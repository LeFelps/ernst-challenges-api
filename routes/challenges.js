import express from "express";
import connectDB from "../database/connection.js";

const router = express.Router();


router.post('/', (request, res) => {
    const con = connectDB()
    const challenge = {

    }
    con.connect(function (err) {
        if (err) throw err;

        let req = request.body

        let challenge = {
            category_id: req.category?.id,
            title: req.title,
            brief: req.brief,
            description: req.description,
            icon: req.icon,
            questions: req.questions,
            checkpoints: req.chackpoints
        }

        con.query("INSERT INTO challenges (categoryId, title, brief, description, icon) VALUES (?, ?, ?, ?, ?)",
            [challenge.category_id, challenge.title, challenge.brief, challenge.description, challenge.icon],
            function (err, result, fields) {
                if (err) throw err;

                challenge.id = result.insertId

                challenge.questions?.length > 0 ?
                    challenge.questions.map((question, q_index) => {
                        con.query("INSERT INTO questions (challengeId, title, type, level) VALUES (?, ?, ?, ?)",
                            [result.insertId, question.title, question.type, question.level],
                            function (err, result, fields) {
                                if (err) throw err;
                                challenge.questions[index].id = result.insertId
                                questions.options.map((option, o_index) => {
                                    con.query("INSERT INTO answers (questionId, type, value, correctAnswer) VALUES (?, ?, ?, ?)",
                                        [result.insertId, option.type, option.value, option.correctAnswer],
                                        function (err, result, fields) {
                                            if (err) throw err;
                                            challenge.questions[q_index].options[o_index].id = result.insertId
                                        });
                                })
                            });
                    })
                    : challenge.questions = []
                cheallenge.checkpoints?.length > 0 ?
                    cheallenge.checkpoints.map((checkpoint, c_index) => {
                        con.query("INSERT INTO checkpoints (challengeId, description, technologies) VALUES (?, ?, ?)",
                            [result.insertId, checkpoint.description, checkpoint.technologies],
                            function (err, result, fields) {
                                if (err) throw err;
                                challenge.checkpoints[index].id = result.insertId
                                questions.references.map((reference, r_index) => {
                                    con.query("INSERT INTO references (checkpointId, title, link) VALUES (?, ?, ?)",
                                        [result.insertId, reference.title, reference.link],
                                        function (err, result, fields) {
                                            if (err) throw err;
                                            challenge.checkpoints[c_index].reference[r_index].id = result.insertId
                                        });
                                })
                            });
                    })
                    : challenge.checkpoints = []
            });
        res.send(challenge)
    });
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
        con.query("INSERT INTO categories (name, accentColor) VALUES (?, ?)",
            [category.name, category.accentColor],
            function (err, result, fields) {
                if (err) throw err;
                res.send({ id: result.insertId, ...category })
            });
    });
})

router.put('/categories', (req, res) => {
    const con = connectDB()
    const category = req.body
    con.connect(function (err) {
        if (err) throw err;
        con.query("UPDATE categories SET  name = ?, accentColor = ? WHERE id = ?",
            [category.name, category.accentColor, category.id],
            function (err, result, fields) {
                if (err) throw err;
                res.send({ ...category })
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