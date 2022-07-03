import express from "express";
import connectDB from "../database/connection.js";

const router = express.Router();


router.get('/', (req, res) => {
    const con = connectDB()
    con.connect(function (err) {
        if (err) throw err;
        con.query("SELECT * FROM challenges", function (err, result, fields) {
            if (err) throw err;
            res.send(result)
        });
    });
    res.send()
})

router.post('/', (req, res) => {
    // const con = connectDB()
    // const challenge = {

    // }
    // con.connect(function (err) {
    //     if (err) throw err;
    //     con.query("INSERT INTO challenges (category_id, title, brief, description, icon) VALUES (?, ?, ?, ?, ?)",
    //         [req],
    //         function (err, result, fields) {
    //             if (err) throw err;
    //             res.send(result)
    //         });
    // });
    // res.send()
    res.send(req)
})

router.get('/categories', (req, res) => {
    const con = connectDB()
    con.connect(function (err) {
        if (err) throw err;
        con.query("SELECT * FROM categories", function (err, result, fields) {
            if (err) throw err;
            res.send(result)
        });
    });
})

router.post('/categories', (req, res) => {
    const con = connectDB()
    const category = req.body
    con.connect(function (err) {
        if (err) throw err;
        con.query("INSERT INTO categories (name, accent_color) VALUES (?, ?)",
            [category.name, category.accentColor],
            function (err, result, fields) {
                if (err) throw err;
                res.send({ id: result.insertId, ...category })
            });
    });
})

router.get('/:[id]', (req, res) => {
    const con = connectDB()
    con.connect(function (err) {
        if (err) throw err;
        con.query("SELECT * FROM challenges", function (err, result, fields) {
            if (err) throw err;
            res.send(result)
        });
    });
    res.send(users)
})

router.get('/categories', (req, res) => {
    const con = connectDB()
    con.connect(function (err) {
        if (err) throw err;
        con.query("SELECT * FROM challenges", function (err, result, fields) {
            if (err) throw err;
            res.send(result)
        });
    });
    res.send(users)
})

export default router