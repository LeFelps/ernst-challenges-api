import express from "express";
import connectDB from '../database/connection.js'

const router = express.Router();

router.post('/', (req, res) => {
    const con = connectDB()

    const reqBody = req.body

    const opponent = {
        name: reqBody.name,
        level: reqBody.level,
        personality: reqBody.personality,
        about: reqBody.about
    }

    con.connect(function (err) {
        if (err) throw err;
        con.query("INSERT INTO opponents (name, level, personality, about) VALUES (?, ?, ?, ?)",
            [opponent.name, opponent.level, opponent.personality, opponent.about],
            function (err, result, fields) {
                if (err) throw err;
                res.send({ id: result.insertId, ...opponent })
            });
    });
})

router.put('/', (req, res) => {
    const con = connectDB()

    const reqBody = req.body

    const opponent = {
        id: reqBody.id,
        name: reqBody.name,
        level: reqBody.level,
        personality: reqBody.personality,
        about: reqBody.about
    }

    con.connect(function (err) {
        if (err) throw err;
        con.query("UPDATE opponents SET name = ?, level = ?, personality = ?, about = ? WHERE id = ?",
            [opponent.name, opponent.level, opponent.personality, opponent.about, opponent.is],
            function (err, result, fields) {
                if (err) throw err;
                res.send({ ...opponent })
            });
    });
})


router.get('/', (req, res) => {
    const con = connectDB()
    con.connect(function (err) {
        if (err) throw err;
        con.query("SELECT * FROM opponents", function (err, result, fields) {
            if (err) throw err;
            res.send(result)
        });
    });
    res.send()
})

router.get('/:id', (req, res) => {
    const con = connectDB()
    con.connect(function (err) {
        if (err) throw err;
        con.query("SELECT * FROM opponents WHERE id = ?", [req.params['id']], function (err, result, fields) {
            if (err) throw err;
            res.send(result)
        });
    });
})

export default router