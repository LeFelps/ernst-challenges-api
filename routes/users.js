import express from "express";
import connectDB from '../database/connection.js'


const router = express.Router();

router.get('/', (req, res) => {
    const con = connectDB()
    con.query("SELECT * FROM users WHERE username = ? AND password = ?", [req.username, req.password], function (err, result, fields) {
        if (err) throw err;

        if (result.length > 0) res.send(true)
        else res.send(false)
    });
})

router.post('/', (req, res) => {
    const con = connectDB()
    con.query("INSERT INTO users (email, password, username) VALUES (?, ?, ?)", [req.username, req.password], function (err, result, fields) {
        if (err) throw err;

    });
})

export default router