import express from "express";
import connectDB from "../database/connection.js";

const router = express.Router();


router.post('/', (req, res) => {
    const con = connectDB()

    con.connect(function (err) {
        if (err) throw err;

        const reqBody = req.body

        let challenge = {
            categoryId: reqBody.category?.id,
            title: reqBody.title,
            brief: reqBody.brief,
            description: reqBody.description,
            icon: reqBody.icon,
            questions: reqBody.questions,
            checkpoints: reqBody.checkpoints
        }

        new Promise((resolve, reject) => {
            resolve(
                con.query("INSERT INTO challenges (categoryId, title, brief, description, icon) VALUES (?, ?, ?, ?, ?)",
                    [challenge.categoryId, challenge.title, challenge.brief, challenge.description, challenge.icon],
                    function (err, result, fields) {
                        if (err) throw err;

                        challenge.id = result.insertId

                        challenge.questions?.length > 0 ?
                            challenge.questions.map((question, q_index) => {
                                con.query("INSERT INTO questions (challengeId, title, type, level) VALUES (?, ?, ?, ?)",
                                    [result.insertId, question.title, question.type, question.level],
                                    function (err, result, fields) {
                                        if (err) throw err;
                                        challenge.questions[q_index].id = result.insertId
                                        if (question?.options?.length > 0)
                                            question.options.map((option, o_index) => {
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
                        challenge.checkpoints?.length > 0 ?
                            challenge.checkpoints.map((checkpoint, c_index) => {
                                con.query("INSERT INTO checkpoints (challengeId, description, technologies) VALUES (?, ?, ?)",
                                    [result.insertId, checkpoint.description, checkpoint.technologies ? checkpoint.technologies.join(';') : ""],
                                    function (err, result, fields) {
                                        if (err) throw err;
                                        challenge.checkpoints[c_index].id = result.insertId
                                        if (checkpoint.references?.length > 0)
                                            checkpoint.references.map((reference, r_index) => {
                                                con.query("INSERT INTO sources (checkpointId, title, link) VALUES (?, ?, ?)",
                                                    [result.insertId, reference.title, reference.link],
                                                    function (err, result, fields) {
                                                        if (err) throw err;
                                                        challenge.checkpoints[c_index].references[r_index].id = result.insertId
                                                    });
                                            })
                                    });
                            })
                            : challenge.checkpoints = []
                    })
            )
        })
            .then(() => {
                res.send(challenge)
            })

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
})

router.get('/:id', (req, res) => {
    const con = connectDB()

    let challenge = {
        checkpoints: [],
        questions: []
    }
    new Promise((resolve, reject) => {
        con.connect(function (err) {
            if (err) throw err;

            con.query("SELECT * FROM challenges WHERE id = ?", [req.params['id']], function (err, result, fields) {
                if (err) throw err;
                challenge = { ...result }
                con.query(`SELECT * FROM questions WHERE challengeId = ${req.params['id']}`, function (err, result, fields) {
                    if (err) throw err;
                    challenge.questions = result
                    con.query(`SELECT * FROM answers ${result.map((question, index) => (
                        `${index !== 0 ? "OR" : "WHERE"} questionId = ${question.id}`
                    ))
                        }`, function (err, result, fields) {
                            if (err) throw err;
                            let answers = result
                            challenge?.questions.map((question, index) => {
                                challenge.questions[index] = answers.filter(a => a.questionId === question.id)
                            })
                        });
                });
                con.query(`SELECT * FROM checkpoints WHERE challengeId = ${req.params['id']}`, function (err, result, fields) {
                    if (err) throw err;
                    challenge.checkpoints = result
                    con.query(`SELECT * FROM sources ${result.map((checkpoint, index) => (
                        `${index !== 0 ? "OR" : "WHERE"} checkpointId = ${checkpoint.id}`
                    ))
                        }`, function (err, result, fields) {
                            if (err) throw err;
                            let sources = result
                            challenge?.checkpoints.map((checkpoint, index) => {
                                challenge.checkpoints[index] = sources.filter(a => a.checkpointId === checkpoint.id)
                            })
                        });
                });
            });
        });
    }).then(() => {
        res.send(challenge)
    })
})

export default router