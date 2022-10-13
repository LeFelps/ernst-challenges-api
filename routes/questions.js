import express from "express";
import connectDB from '../database/connection.js'

const router = express.Router();

router.get('/random', (req, res) => {
    const con = connectDB()

    const challengeId = req.query?.challengeId

    let query = `SELECT * FROM questions `
    if (challengeId) query += `WHERE challengeId = ${challengeId} `;
    query += 'ORDER BY RAND() LIMIT 1'

    con.query(query, function (err, result, fields) {
        if (err) throw err;
        let question = result[0]
        new Promise((resolve, reject) => {
            con.query(`SELECT id, value, type FROM answers WHERE questionId = ${question?.id}`, function (err, result, fields) {
                if (err) throw err;
                resolve(result)
            });
        }).then((resp) => {
            question.answers = [...resp]
            res.send(question)
            con.end()
        })
    });
})

router.get('/is-answer/:id', (req, res) => {
    const con = connectDB()

    const id = req.params['id']

    let query = `SELECT * FROM answers WHERE id = ${id}`

    con.query(query, function (err, result, fields) {
        if (err) throw err;
        res.send(!!result[0].correctAnswer)
        con.end()
    });
})



export default router