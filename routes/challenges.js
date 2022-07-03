import express from "express";
import connectDB from "../database/connection.js";

const router = express.Router();


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
            if (req.query?.min !== 'true') {

                let fullCategories = [...result]

                con.query("SELECT * FROM challenges", function (err, result, fields) {
                    if (err) throw err;

                    let challenges = [...result]

                    fullCategories.map((category, index) => {
                        fullCategories[index].challenges = challenges.filter(c => c.categoryId === category.id)
                        return category
                    })

                    res.send(fullCategories)
                });
            } else {
                res.send(result)
            }



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

router.get('/:id', (req, res) => {
    const con = connectDB()
    con.connect(function (err) {
        if (err) throw err;
        con.query("SELECT * FROM challenges", function (err, result, fields) {
            if (err) throw err;
            res.send(result)
        });
    });
})

export default router