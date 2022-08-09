import express from "express";
import connectDB from '../database/connection.js'


const router = express.Router();

router.post('/login', (req, res) => {
    const con = connectDB()

    const reqBody = req.body
    con.query("SELECT * FROM users WHERE username = ? AND password = ?", [reqBody.username, reqBody.password], function (err, result, fields) {
        if (err) throw err;
        if (result.length > 0) {
            const user = result[0]
            res.send({
                id: user.id,
                name: user.username,
                email: user.email,
                lastLogin: Date.now(),
            })
        }
        else res.send(false)
    });
})

router.put('/', (req, res) => {

    const reqBody = req.body

    const user = {
        id: reqBody.id,
        languages: reqBody.languages
    }

    const con = connectDB()
    // TODO 
    // Add all values for users PUT endpoint 
    con.query(`UPDATE SET users = ? WHERE id = ${user.id}`, [user.languages, req.password], function (err, result, fields) {
        if (err) throw err;
        res.send(user)
    });
})

router.post('/signup', (req, res) => {
    const con = connectDB()

    const reqBody = req.body
    con.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [reqBody.username, reqBody.email, reqBody.password], function (err, result, fields) {
        if (err) throw err;
        res.send({
            id: result.insertId,
            name: reqBody.username,
            email: reqBody.email,
            lastLogin: Date.now(),
        })
    });
})

export default router