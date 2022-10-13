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

router.put('/change-visibility', (req, res) => {
    const con = connectDB()

    const reqBody = req.body
    con.query("UPDATE users SET public = ? WHERE id = ?", [!reqBody.public, reqBody.id], function (err, result, fields) {
        if (err) throw err;
        res.send(!reqBody.public)
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

    const jobId = req.query['byJob']

    const query = 'SELECT ' +
        'users.id, users.username, users.email, users.fullName, users.phone, users.jobTitle, users.jobLevel, users.categoryId, ' +
        'categories.accentColor, users.skills, users.languages, users.experience, users.education ' +
        'FROM users ' +
        'INNER JOIN categories ON categories.id = categoryId ' +
        `${jobId ? 'INNER JOIN user_applications ON user_applications.userId = users.id ' : ''}` +
        'WHERE' +
        `${jobId ? ' user_applications.jobId = ' + jobId : ' users.public = true'}`

    const reqBody = req.body
    con.query(query, function (err, result, fields) {
        if (err) throw err;

        let users = result

        users.map((user, index) => {
            users[index].skills = JSON.parse(user?.skills)
            users[index].languages = JSON.parse(user?.languages)
            users[index].experience = JSON.parse(user?.experience)
            users[index].education = JSON.parse(user?.education)
            users[index].category = {
                accentColor: user.accentColor,
                id: user.categoryId
            }

            delete user.categoryId
            delete user.accentColor
            return
        })

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