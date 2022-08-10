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
    });
})

router.get('/:id', (req, res) => {
    const con = connectDB()

    const reqBody = req.body
    con.query("SELECT * from user_applications WHERE userId = ?", [req.params['id']], function (err, result, fields) {
        if (err) throw err;

        let jobIds = []

        result.map(res => {
            if (jobIds.indexOf(res.jobId) < 0) {
                jobIds.push(res.jobId)
            }
        })

        if (jobIds.length > 0) {
            let query = 'SELECT jobs.title, jobs.companyName, jobs.salary, jobs.hideSalary, jobs.level, jobs.compensations, categories.accentColor FROM jobs INNER JOIN categories ON categories.id=jobs.categoryId WHERE'

            jobIds.map((id, index) => {
                query += `${index !== 0 ? 'OR' : ''} jobs.id = ${id} `
            })

            con.query(query, [reqBody.userId, reqBody.jobId], function (err, result, fields) {
                if (err) throw err;

                result.map((job, index) => {
                    result[index].compensations = job.compensations.split(";")
                })

                res.send(result)
            });
        } else res.send([])

    });
})

router.delete('/', (req, res) => {
    const con = connectDB()

    const reqBody = req.body
    con.query("DELETE * from user_applications WHERE userId = ? AND jobId = ?", [reqBody.userId, reqBody.jobId], function (err, result, fields) {
        if (err) throw err;
        res.send(result)
    });
})

export default router