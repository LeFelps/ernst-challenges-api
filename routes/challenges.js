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
                                            [result.insertId, question.title, question.type, question.level],
                                            function (err, result, fields) {
                                                if (err) reject(err);

                                                challenge.questions[q_index].id = result.insertId
                                                let answerList = []
                                                if (question?.answers?.length > 0) {
                                                    question.answers.map((answer, a_index) => {
                                                        answerList.push([result.insertId, answer.type, answer.value, answer.correctAnswer])
                                                    })
                                                    console.log(answerList)
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
                                        con.query("INSERT INTO checkpoints (challengeId, description, technologies) VALUES (?, ?, ?)",
                                            [result.insertId, checkpoint.description, checkpoint.technologies ? checkpoint.technologies.join(';') : ""],
                                            function (err, result, fields) {
                                                if (err) reject(err);
                                                challenge.checkpoints[c_index].id = result.insertId
                                                let referenceList = []
                                                if (checkpoint.references?.length > 0) {
                                                    checkpoint.references.map((reference, r_index) => {
                                                        referenceList.push([result.insertId, reference.title, reference.link])
                                                        challenge.checkpoints[c_index].id = result.insertId
                                                    })
                                                    con.query(`INSERT INTO sources (checkpointId, title, link) VALUES ${referenceList.map(reference => (
                                                        `(${reference[0]},'${reference[1]}','${reference[2]}')`
                                                    ))}`,
                                                        function (err, result, fields) {
                                                            if (err) reject(err);
                                                            resolve(result)
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
                    })
                ]).then(resp => {
                    res.send(challenge)
                }).catch(err => {

                })
            })
    });
})

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

        con.query("UPDATE challenges SET categoryId = ?, title = ?, brief = ?, description = ?, icon = ? WHERE id = ?",
            [challenge.categoryId, challenge.title, challenge.brief, challenge.description, challenge.icon, challenge.id],
            function (err, result, fields) {
                if (err) throw err;

                challenge.id = result.insertId

                challenge.questions?.length > 0 ?
                    challenge.questions.map((question, q_index) => {
                        con.query(question.id ? `UPDATE questions SET challengeId = ?, title = ?, type = ?, level = ? WHERE id = ${question.id}`
                            : "INSERT INTO questions (challengeId, title, type, level) VALUES (?, ?, ?, ?)",
                            [result.insertId, question.title, question.type, question.level],
                            function (err, result, fields) {
                                if (err) throw err;
                                challenge.questions[q_index].id = result.insertId
                                if (question?.options?.length > 0)
                                    question.options.map((option, o_index) => {
                                        con.query(option.id ? `UPDATE answers SET questionId = ?, type = ?, value = ?, correctAnswer = ? WHERE id = ${option.id}`
                                            : "INSERT INTO answers (questionId, type, value, correctAnswer) VALUES (?, ?, ?, ?)",
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
                        con.query(checkpoint.id ? `UPDATE checkpoints SET challengeId = ?, description = ?, technologies = ? WHERE id = ${checkpoint.id}`
                            : "INSERT INTO checkpoints (challengeId, description, technologies) VALUES (?, ?, ?)",
                            [result.insertId, checkpoint.description, checkpoint.technologies ? checkpoint.technologies.join(';') : ""],
                            function (err, result, fields) {
                                if (err) throw err;
                                challenge.checkpoints[c_index].id = result.insertId
                                if (checkpoint.references?.length > 0)
                                    checkpoint.references.map((reference, r_index) => {
                                        con.query(reference.id ? `UPDATE sources SET checkpointId = ?, title = ?, link = ? WHERE id = ${reference.id}`
                                            : "INSERT INTO sources (checkpointId, title, link) VALUES (?, ?, ?)",
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
        con.query("UPDATE categories SET name = ?, accentColor = ? WHERE id = ?",
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
                        let query = 'SELECT * FROM sources WHERE'
                        checkpointResult.map((checkpoint, index) => (
                            query += `${index !== 0 ? ' OR' : ''} checkpointId=${checkpoint.id}`
                        ))
                        con.query(query, [response.categoryId], function (err, sourceResult, fields) {
                            if (err) reject(err);

                            let checkpointList = [...checkpointResult]
                            checkpointList.map((checkpoint, index) => {
                                checkpointList[index].answers = sourceResult.filter(s => s.checkpointId === checkpoint.id)
                                return
                            })

                            resolve([...checkpointList])

                        })
                    } else resolve([...checkpointResult])

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

        }).catch(err => {

        })
    }).catch(err => {

    })
})

export default router