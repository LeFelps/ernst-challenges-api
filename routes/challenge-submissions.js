import express from "express";
import connectDB from '../database/connection.js'


const router = express.Router();

router.post('/', (req, res) => {
    const con = connectDB()

    const reqBody = req.body
    con.query("INSERT INTO user_checkpoints (userId, checkpointId, link, completed) VALUES (?, ?, ?, ?)", [reqBody.userId, reqBody.checkpointId, reqBody.link, reqBody.completed], function (err, result, fields) {
        if (err) throw err;
        res.send({
            userId: reqBody.userId,
            checkpointId: reqBody.checkpointId,
            link: reqBody.link,
            completed: reqBody.completed
        })
        con.end()
    });
})

router.put('/', (req, res) => {
    const con = connectDB()

    const reqBody = req.body
    con.query("UPDATE user_checkpoints SET link = ?, completed = ? WHERE userId = ? AND checkpointId = ?", [reqBody.link, reqBody.completed, reqBody.userId, reqBody.checkpointId], function (err, result, fields) {
        if (err) throw err;
        res.send({
            userId: reqBody.userId,
            checkpointId: reqBody.checkpointId,
            link: reqBody.link,
            completed: reqBody.completed
        })
        con.end()
    });
})

router.get('/', (req, res) => {
    const con = connectDB()

    const userId = req.query?.userId
    const challengeId = req.query?.challengeId

    const reqBody = req.body
    con.query("SELECT user_checkpoints.checkpointId, user_checkpoints.link, user_checkpoints.completed FROM user_checkpoints INNER JOIN checkpoints ON user_checkpoints.checkpointId = checkpoints.id WHERE user_checkpoints.userId = ? AND checkpoints.challengeId", [userId, challengeId], function (err, result, fields) {
        if (err) throw err;

        result.map((s, index) => {
            result[index].existing = true
        })

        res.send(result)
        con.end()
    });
})

router.get('/:id', (req, res) => {
    const con = connectDB()

    const reqBody = req.body
    con.query("SELECT user_checkpoints.userId, user_checkpoints.checkpointId, user_checkpoints.link, user_checkpoints.completed, checkpoints.challengeId FROM user_checkpoints INNER JOIN checkpoints ON user_checkpoints.checkpointId=checkpoints.id WHERE userId = ?", [req.params['id']], function (err, result, fields) {
        if (err) throw err;

        let challengeIds = []
        let checkpointSubmissions = result

        result.map(res => {
            if (challengeIds.indexOf(res.challengeId) < 0) {
                challengeIds.push(res.challengeId)
            }
        })

        if (challengeIds.length > 0) {
            let challengeQuery = 'SELECT challenges.id, challenges.title, challenges.icon, categories.accentColor FROM challenges INNER JOIN categories ON categories.id=challenges.categoryId WHERE'
            let checkpointQuery = 'SELECT id, challengeId FROM checkpoints WHERE'

            challengeIds.map((id, index) => {
                challengeQuery += `${index !== 0 ? 'OR' : ''} challenges.id = ${id} `
                checkpointQuery += `${index !== 0 ? 'OR' : ''} challengeId = ${id} `
            })

            Promise.all([
                new Promise((resolve, reject) => {
                    con.query(challengeQuery, function (err, result, fields) {
                        if (err) reject(err);

                        resolve(result)
                    });
                }),
                new Promise((resolve, reject) => {
                    con.query(checkpointQuery, function (err, result, fields) {
                        if (err) reject(err);

                        resolve(result)
                    });
                })
            ]).then(([challenges, checkpoints]) => {
                challenges.map((challenge, index) => {
                    challenges[index].checkpoints = checkpoints.filter(c => c.challengeId === challenge.id)
                    challenges[index].submissions = checkpointSubmissions.filter(c => c.challengeId === challenge.id)
                })

                res.send(challenges)
                con.end()
            }).catch(err => {
                console.log(err)
                res.send([])
                con.end()
            })
        } else {
            res.send([])
            con.end()
        }
    });
})

router.delete('/', (req, res) => {
    const con = connectDB()

    const reqBody = req.body
    con.query(`DELETE FROM user_checkpoints WHERE id = ${reqBody.id}`, function (err, result, fields) {
        if (err) throw err;
        res.send(result)
        con.end()
    });
})

export default router