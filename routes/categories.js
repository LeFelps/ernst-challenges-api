import express from "express";
import connectDB from "../database/connection.js";

const router = express.Router();

router.get('/', (req, res) => {
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
                    con.end()
                });
            } else {
                res.send(result)
                con.end()
            }
        });
    });
})

router.post('/', (req, res) => {
    const con = connectDB()
    const category = req.body
    con.connect(function (err) {
        if (err) throw err;
        con.query("INSERT INTO categories (name, accentColor) VALUES (?, ?)",
            [category.name, category.accentColor],
            function (err, result, fields) {
                if (err) throw err;
                res.send({ ...category, id: result.insertId })
                con.end()
            });
    });
})

router.put('/', (req, res) => {
    const con = connectDB()
    const category = req.body
    con.connect(function (err) {
        if (err) throw err;
        con.query("UPDATE categories SET name = ?, accentColor = ? WHERE id = ?",
            [category.name, category.accentColor, category.id],
            function (err, result, fields) {
                if (err) throw err;
                res.send({ ...category })
                con.end()
            });
    });
})

router.delete('/:id', (req, res) => {
    const con = connectDB()
    con.connect(function (err) {
        if (err) throw err;
        con.query("DELETE FROM categories WHERE id = ?",
            [req.params['id']],
            function (err, result, fields) {
                if (err) throw err;
                res.send()
                con.end()
            });
    });
})


export default router