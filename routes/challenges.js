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

        con.query("INSERT INTO challenges (categoryId, title, brief, description, icon) VALUES (?, ?, ?, ?, ?)",
            [challenge.categoryId, challenge.title, challenge.brief, challenge.description, challenge.icon],
            function (err, result, fields) {
                if (err) throw err;

                challenge.id = result.insertId

                Promise.all([
                    new Promise((resolve, reject) => {
                        challenge.questions?.length > 0 ?
                            Promise.all([
                                challenge.questions.map((question, q_index) => {
                                    return new Promise((resolve, reject) => {
                                        con.query("INSERT INTO questions (challengeId, title, type, level) VALUES (?, ?, ?, ?)",
                                            [challenge.id, question.title, question.type, question.level],
                                            function (err, result, fields) {
                                                if (err) reject(err);

                                                challenge.questions[q_index].id = result.insertId
                                                let answerList = []
                                                if (question?.answers?.length > 0) {
                                                    question.answers.map((answer, a_index) => {
                                                        answerList.push([result.insertId, answer.type, answer.value, answer.correctAnswer])
                                                    })
                                                    con.query(`INSERT INTO answers (questionId, type, value, correctAnswer) VALUES ${answerList.map(answer => (
                                                        `(${answer[0]},'${answer[1]}','${answer[2]}',${answer[3]})`
                                                    ))}`,
                                                        function (err, result, fields) {
                                                            if (err) reject(err);
                                                            resolve()
                                                        });
                                                }
                                            });
                                    }).then(response => {
                                        resolve()
                                    }).catch(error => {
                                        reject()
                                    })
                                })
                            ])
                                .then(response => {
                                    resolve()
                                })
                                .catch(error => {
                                    reject()
                                })
                            : resolve([])
                    }),
                    new Promise((resolve, reject) => {
                        challenge.checkpoints?.length > 0 ?
                            Promise.all([
                                challenge.checkpoints.map((checkpoint, c_index) => {
                                    return new Promise((resolve, reject) => {
                                        con.query("INSERT INTO checkpoints (challengeId, description, technologies, sources) VALUES (?, ?, ?, ?)",
                                            [
                                                challenge.id,
                                                checkpoint.description,
                                                checkpoint.technologies ? JSON.stringify(checkpoint.technologies) : null,
                                                checkpoint.sources ? JSON.stringify(checkpoint.sources) : null,
                                            ],
                                            function (err, result, fields) {
                                                if (err) reject(err);
                                                challenge.checkpoints[c_index].id = result.insertId
                                            });
                                    }).then(response => {
                                        resolve()
                                    }).catch(error => {
                                        reject()
                                    })
                                })
                            ])
                                .then(response => {
                                    resolve()
                                })
                                .catch(error => {
                                    reject()
                                })
                            : resolve([])
                    })
                ]).then(resp => {
                    res.send(challenge)
                    con.end()
                }).catch(err => {

                })
            })
    });
})


// Check for missing items and delete from database
// ex. DELETE FROM answers WHERE questionID=# AND id!=# AND id!=#...
router.put('/', (req, res) => {
    const con = connectDB()

    con.connect(function (err) {
        if (err) throw err;

        const reqBody = req.body

        let challenge = {
            id: reqBody.id,
            categoryId: reqBody.category?.id,
            title: reqBody.title,
            brief: reqBody.brief,
            description: reqBody.description,
            icon: reqBody.icon,
            questions: reqBody.questions,
            checkpoints: reqBody.checkpoints
        }

        new Promise((resolve, reject) => {
            con.query("UPDATE challenges SET categoryId = ?, title = ?, brief = ?, description = ?, icon = ? WHERE id = ?",
                [challenge.categoryId, challenge.title, challenge.brief, challenge.description, challenge.icon, challenge.id],
                function (err, result, fields) {
                    if (err) reject(err);
                    resolve(result)
                })
        }).then(res => {
            Promise.all([
                new Promise((resolve, reject) => {
                    challenge.questions?.length > 0 ?
                        Promise.all([
                            challenge.questions.map((question, q_index) => {
                                new Promise((resolve, reject) => {
                                    con.query(question.id ? `UPDATE questions SET challengeId = ?, title = ?, type = ?, level = ? WHERE id = ${question.id}`
                                        : "INSERT INTO questions (challengeId, title, type, level) VALUES (?, ?, ?, ?)",
                                        [challenge.id, question.title, question.type, question.level],
                                        function (err, result, fields) {
                                            if (err) reject(err);
                                            challenge.questions[q_index].id = result.insertId
                                            if (question?.options?.length > 0) {
                                                Promise.all([
                                                    question.options.map((option, o_index) => {
                                                        new Promise((resolve, reject) => {
                                                            con.query(option.id ? `UPDATE answers SET questionId = ?, type = ?, value = ?, correctAnswer = ? WHERE id = ${option.id}`
                                                                : "INSERT INTO answers (questionId, type, value, correctAnswer) VALUES (?, ?, ?, ?)",
                                                                [result.insertId, option.type, option.value, option.correctAnswer],
                                                                function (err, result, fields) {
                                                                    if (err) reject(err);
                                                                    challenge.questions[q_index].options[o_index].id = result.insertId
                                                                    resolve()
                                                                });
                                                        })
                                                    })
                                                ]).then(res => {
                                                    resolve()
                                                })
                                            } else resolve()
                                        });
                                })
                            })
                        ])
                        : resolve([])
                }),
                new Promise((resolve, reject) => {
                    challenge.checkpoints?.length > 0 ?
                        Promise.all([
                            challenge.checkpoints.map((checkpoint, c_index) => {
                                con.query(checkpoint.id ? `UPDATE checkpoints SET challengeId = ?, description = ?, technologies = ? WHERE id = ${checkpoint.id}`
                                    : "INSERT INTO checkpoints (challengeId, description, technologies, sources) VALUES (?, ?, ?, ?)",
                                    [challenge.id, checkpoint.description, checkpoint.technologies ? JSON.stringify(checkpoint.technologies) : "[]", JSON.stringify(checkpoint.sources)],
                                    function (err, result, fields) {
                                        if (err) reject(err);
                                        challenge.checkpoints[c_index].id = result.insertId
                                        resolve()
                                    });
                            })
                        ]).then(res => {
                            resolve()
                        }).catch(err => {
                            reject(err)
                        })
                        : resolve([])
                })
            ]).then(res => {
                res.send(challenge)
            }).catch(err => {
            })
        }).catch(err => {
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
                    con.end()
                });
            } else {
                res.send(result)
                con.end()
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
                res.send({ ...category, id: result.insertId })
                con.end()
            });
    });
})

router.put('/categories', (req, res) => {
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

router.get('/', (req, res) => {
    const con = connectDB()
    con.connect(function (err) {
        if (err) throw err;
        con.query("SELECT * FROM challenges", function (err, result, fields) {
            if (err) throw err;
            res.send(result)
            con.end()
        });
    });
}) 

router.get('/:id', (req, res) => {
    const con = connectDB()

    let challenge = {
        category: {},
        checkpoints: [],
        questions: []
    }

    new Promise((resolve, reject) => {
        con.query("SELECT * FROM challenges WHERE id = ?", [req.params['id']], function (err, result, fields) {
            if (err) reject(err);
            resolve({ ...result[0] })
        });
    }).then(response => {
        challenge = {
            ...response,
        }
        Promise.all([
            new Promise((resolve, reject) => {
                con.query("SELECT * FROM categories WHERE id = ?", [response.categoryId], function (err, result, fields) {
                    if (err) reject(err);
                    resolve({ ...result[0] })
                });
            }),
            new Promise((resolve, reject) => {
                con.query("SELECT * FROM questions WHERE challengeId = ?", [req.params['id']], function (err, questionResult, fields) {
                    if (err) reject(err);

                    if (questionResult.length > 0) {
                        let query = 'SELECT * FROM answers WHERE'
                        questionResult.map((question, index) => (
                            query += `${index !== 0 ? ' OR' : ''} questionId=${question.id}`
                        ))

                        con.query(query, [response.categoryId], function (err, answerResult, fields) {
                            if (err) reject(err);

                            let questionList = [...questionResult]
                            questionList.map((question, index) => {
                                questionList[index].answers = answerResult.filter(a => a.questionId === question.id)
                                return
                            })

                            resolve([...questionList])

                        })
                    } else resolve([...questionResult])
                });
            }),
            new Promise((resolve, reject) => {
                con.query("SELECT * FROM checkpoints WHERE challengeId = ?", [req.params['id']], function (err, checkpointResult, fields) {
                    if (err) reject(err);

                    if (checkpointResult.length > 0) {
                        checkpointResult.map((checkpoint, index) => {
                            checkpointResult[index].sources = JSON.parse(checkpoint.sources)
                            checkpointResult[index].technologies = JSON.parse(checkpoint.technologies)
                            return checkpoint
                        })
                    }

                    resolve([...checkpointResult])
                });
            })
        ]).then(([
            category,
            questions,
            checkpoints
        ]) => {

            challenge = {
                ...challenge,
                category: category,
                questions: questions,
                checkpoints: checkpoints
            }

            res.send(challenge)
            con.end()

        }).catch(err => {

        })
    }).catch(err => {

    })
})

export default router