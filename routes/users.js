import express from "express";
import connectDB from '../database/connection.js'


const router = express.Router();

router.post('/login', (req, res) => {
    const con = connectDB()

    const reqBody = req.body
    con.query("SELECT * FROM users WHERE username = ? AND password = ?", [String(reqBody.username).toLowerCase(), reqBody.password], function (err, result, fields) {
        if (err) throw err;
        if (result.length > 0) {
            const user = result[0]
            res.send({
                id: user.id,
                name: user.username,
                email: user.email,
                lastLogin: Date.now(),
            })
            con.end()
        }
        else {
            res.send(false)
            con.end()
        }
    });
})

router.put('/', (req, res) => {

    const reqBody = req.body

    const user = {
        id: reqBody.id,
        fullName: reqBody.fullName,
        email: reqBody.email,
        phone: reqBody.phone,
        jobTitle: reqBody.jobTitle,
        jobLevel: reqBody.jobLevel,
        skills: reqBody.skills,
        languages: reqBody.languages,
        experience: reqBody.experience,
        education: reqBody.education,
        categoryId: reqBody.category?.id
    }

    const con = connectDB()
    const query = `UPDATE users SET fullName = ?, email = ?, phone = ?, jobTitle = ?, jobLevel = ?, skills = ?, languages = ?, experience = ?, education = ?, categoryId = ? WHERE id = ${user.id}`

    con.query(query, [
        user.fullName,
        user.email,
        user.phone,
        user.jobTitle,
        user.jobLevel,
        user.skills ? JSON.stringify(user.skills) : null,
        user.languages ? JSON.stringify(user.languages) : null,
        user.experience ? JSON.stringify(user.experience) : null,
        user.education ? JSON.stringify(user.education) : null,
        user.categoryId
    ], function (err, result, fields) {
        if (err) throw err;
        res.send(user)
        con.end()
    });
})

router.get('/', (req, res) => {
    const con = connectDB()

    const reqBody = req.body
    con.query("SELECT * FROM users", function (err, result, fields) {
        if (err) throw err;
        res.send(result)
        con.end()
    });
})

router.get('/public', (req, res) => {
    const con = connectDB()

    const reqBody = req.body
    con.query("SELECT * FROM users WHERE public = true", function (err, result, fields) {
        if (err) throw err;
        res.send(result)
        con.end()
    });
})

router.get('/:id', (req, res) => {
    const con = connectDB()

    con.query(`SELECT * FROM users WHERE id = ${req.params['id']}`, function (err, result, fields) {
        if (err) throw err;
        let user = { ...result[0] }

        con.query(`SELECT * FROM categories WHERE id = ${user.categoryId}`, function (err, result, fields) {
            if (err) throw err;

            user = {
                ...user,
                skills: JSON.parse(user?.skills),
                languages: JSON.parse(user?.languages),
                experience: JSON.parse(user?.experience),
                education: JSON.parse(user?.education),
                category: result[0]
            }

            res.send(user)
            con.end()
        });

    });
})

router.post('/signup', (req, res) => {
    const con = connectDB()

    const reqBody = req.body
    con.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [String(reqBody.username).toLowerCase(), reqBody.email, reqBody.password], function (err, result, fields) {
        if (err) throw err;
        res.send({
            id: result.insertId,
            name: reqBody.username,
            email: reqBody.email,
            lastLogin: Date.now(),
        })
        con.end()
    });
})


export default router