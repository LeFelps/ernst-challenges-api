import express from "express";
import connectDB from '../database/connection.js'

const router = express.Router();

router.post('/', (req, res) => {
    const con = connectDB()

    const reqBody = req.body
    con.query("INSERT INTO user_applications (userId, jobId) VALUES (?, ?)", [reqBody.userId, reqBody.jobId], function (err, result, fields) {
        if (err) throw err;
        res.send({
            userId: reqBody.userId,
            jobId: reqBody.jobId
        })
        con.end()
    });
})

router.get('/:id', (req, res) => {
    const con = connectDB()

    const userId = req.params['id']
    const jobId = req.query?.jobId

    let query = `SELECT * from user_applications WHERE userId = ${userId}`
    if (jobId) query += ` AND jobId = ${jobId}`

    con.query(query, function (err, result, fields) {
        if (err) throw err;

        if (jobId) {
            res.send(result.length > 0)
            con.end()
        }
        else {
            let jobIds = []

            result.map(res => {
                if (jobIds.indexOf(res.jobId) < 0) {
                    jobIds.push(res.jobId)
                }
            })

            if (jobIds.length > 0) {
                let query = 'SELECT jobs.id, jobs.title, jobs.companyName, jobs.salary, jobs.hideSalary, jobs.level, jobs.compensations, categories.accentColor FROM jobs INNER JOIN categories ON categories.id=jobs.categoryId WHERE'

                jobIds.map((id, index) => {
                    query += `${index !== 0 ? 'OR' : ''} jobs.id = ${id} `
                })

                con.query(query, [userId, jobId], function (err, result, fields) {
                    if (err) throw err;

                    result.map((job, index) => {
                        result[index].compensations = JSON.parse(job.compensations)
                    })

                    res.send(result)
                    con.end()
                });
            } else {
                res.send([])
                con.end()
            }
        }
    });
})

router.delete('/', (req, res) => {
    const con = connectDB()

    const userId = req.query?.userId
    const jobId = req.query?.jobId

    con.query("DELETE FROM user_applications WHERE userId = ? AND jobId = ?", [userId, jobId], function (err, result, fields) {
        if (err) throw err;
        res.send(result)
        con.end()
    });
})

export default router