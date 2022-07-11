import express from "express";
import connectDB from "../database/connection.js";

const router = express.Router();


router.post('/', (req, res) => {
    const con = connectDB()
    const job = req.body
    con.connect(function (err) {
        if (err) throw err;
        con.query("INSERT INTO jobs () VALUES ()",
            [],
            function (err, result, fields) {
                if (err) throw err;
                res.send({ id: result.insertId, ...job })
            });
    });
})

router.put('/', (req, res) => {
    const con = connectDB()
    const job = req.body
    con.connect(function (err) {
        if (err) throw err;
        con.query("UPDATE jobs SET  WHERE id = ?",
            [],
            function (err, result, fields) {
                if (err) throw err;
                res.send({ ...job })
            });
    });
})


router.get('/', (req, res) => {
    const con = connectDB()
    con.connect(function (err) {
        if (err) throw err;
        con.query("SELECT * FROM jobs", function (err, result, fields) {
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
        con.query("SELECT * FROM jobs", function (err, result, fields) {
            if (err) throw err;
            res.send(result)
        });
    });
})

export default router