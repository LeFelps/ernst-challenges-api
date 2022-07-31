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

router.put('/', (req, res) => {

    const reqBody = req.body

    const user = {
        id: reqBody.id,
        languages: reqBody.languages
    }

    const con = connectDB()
    // TODO 
    // Add all values for users PUT endpoint 
    con.query(`UPDATE SET languages = ? WHERE id = ${user.id}`, [user.languages, req.password], function (err, result, fields) {
        if (err) throw err;
        res.send(user)
    });
})

router.post('/', (req, res) => {
    const con = connectDB()
    con.query("INSERT INTO users (email, password, username) VALUES (?, ?, ?)", [req.username, req.password], function (err, result, fields) {
        if (err) throw err;

    });
})

export default router