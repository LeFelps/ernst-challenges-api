import express from "express";
import connectDB from '../database/connection.js'


const router = express.Router();

router.post('/login', (req, res) => {
    const con = connectDB()

    const reqBody = req.body
    con.query("SELECT * FROM users WHERE username = ? AND password = ?", [reqBody.username, reqBody.password], function (err, result, fields) {
        if (err) throw err;
        if (result.length > 0) {
            const user = result[0]
            res.send({
                id: user.id,
                name: user.username,
                email: user.email,
                lastLogin: Date.now(),
            })
        }
        else res.send(false)
    });
})

router.put('/', (req, res) => {

    const reqBody = req.body

    const user = {
        id: reqBody.id,
        languages: reqBody.languages
    }

    const con = connectDB()
    // TODO 
    // Add all values for users PUT endpoint 
    con.query(`UPDATE users SET fullName, phone, categoryId, level, points, jobPosition, public WHERE id = ${user.id}`, [user.languages, req.password], function (err, result, fields) {
        if (err) throw err;
        res.send(user)
    });
})

router.get('/:id', (req, res) => {
    const con = connectDB()

    const reqBody = req.body
    con.query(`SELECT * FROM users WHERE id = ${req.prarms['id']}`, function (err, result, fields) {
        if (err) throw err;
        res.send(result[0])
    });
})

router.get('/', (req, res) => {
    const con = connectDB()

    const reqBody = req.body
    con.query("SELECT * FROM users", function (err, result, fields) {
        if (err) throw err;
        res.send(result)
    });
})

router.post('/signup', (req, res) => {
    const con = connectDB()

    const reqBody = req.body
    con.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [reqBody.username, reqBody.email, reqBody.password], function (err, result, fields) {
        if (err) throw err;
        res.send({
            id: result.insertId,
            name: reqBody.username,
            email: reqBody.email,
            lastLogin: Date.now(),
        })
    });
})


router.post('/apply-job', (req, res) => {
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

router.get('/apply-job/:id', (req, res) => {
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

router.delete('/apply-job', (req, res) => {
    const con = connectDB()

    const reqBody = req.body
    con.query("DELETE * from user_applications WHERE userId = ? AND jobId = ?", [reqBody.userId, reqBody.jobId], function (err, result, fields) {
        if (err) throw err;
        res.send(result)
    });
})

router.post('/challenge-submit', (req, res) => {
    const con = connectDB()

    const reqBody = req.body
    con.query("INSERT INTO user_checkpoints (userId, checkpointId, link, completed) VALUES (?, ?)", [reqBody.userId, reqBody.checkpointId, reqBody.link, reqBody.completed], function (err, result, fields) {
        if (err) throw err;
        res.send({
            userId: reqBody.userId,
            checkpointId: reqBody.checkpointId,
            link: reqBody.link,
            completed: reqBody.completed
        })
    });
})

router.get('/challenge-submit', (req, res) => {
    const con = connectDB()

    const reqBody = req.body
    con.query("SELECT * from user_checkpoints WHERE userId = ?", [req.params['id']], function (err, result, fields) {
        if (err) throw err;
        res.send(result)
    });
})

router.delete('/challenge-submit', (req, res) => {
    const con = connectDB()

    const reqBody = req.body
    con.query("UPDATE user_checkpoints SET link = ?, completed = ? WHERE userId = ? AND checkpointId = ?", [reqBody.link, reqBody.completed, reqBody.userId, reqBody.checkpointId], function (err, result, fields) {
        if (err) throw err;
        res.send(result)
    });
})

export default router