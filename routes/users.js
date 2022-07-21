import express from "express";
import connectDB from '../database/connection.js'


const router = express.Router();

router.get('/', (req, res) => {
    res.send(users)
    con.query("SELECT * FROM users WHERE username = ? AND password = ?", [req.username, req.password], function (err, result, fields) {
        if (err) throw err;
        challenge = { ...challenge, ...result }
    });
})

export default router