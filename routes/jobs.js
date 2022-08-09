import express from "express";
import connectDB from "../database/connection.js";

const router = express.Router();

router.post('/', (req, res) => {
    const con = connectDB()

    const reqBody = req.body

    const job = {
        categoryId: reqBody.category?.id,
        title: reqBody.title,
        level: reqBody.level,
        location: reqBody.location,
        remote: reqBody.remote,
        description: reqBody.description,
        responsabilities: reqBody.responsabilities,
        compensations: reqBody.compensations,
        requirements: reqBody.requirements,
        companyName: reqBody.companyName,
        salary: reqBody.salary,
        hideSalary: reqBody.hideSalary,
    }

    con.connect(function (err) {
        if (err) throw err;
        con.query("INSERT INTO jobs (categoryId, title, level, location, remote, description, responsabilities, compensations, requirements, companyName, salary, hideSalary) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [job.categoryId, job.title, job.level, job.location, job.remote, job.description, job.responsabilities.join(";"), job.compensations.join(";"), job.requirements.join(";"), job.companyName, job.salary, job.hideSalary],
            function (err, result, fields) {
                if (err) throw err;
                res.send({ id: result.insertId, ...job })
            });
    });
})

router.put('/', (req, res) => {
    const con = connectDB()

    const reqBody = req.body

    const job = {
        id: job.id,
        categoryId: reqBody.category?.id,
        title: reqBody.title,
        level: reqBody.level,
        location: reqBody.location,
        remote: reqBody.remote,
        description: reqBody.description,
        responsabilities: reqBody.responsabilities,
        compensations: reqBody.compensations,
        requirements: reqBody.requirements,
        businessName: reqBody.requirements,
        salary: reqBody.salary,
        hideSalary: reqBody.hideSalary,
    }
    con.connect(function (err) {
        if (err) throw err;
        con.query("UPDATE jobs SET categoryId = ?, title = ?, level = ?, location = ?, remote = ?, description = ?, responsabilities = ?, compensations = ?, requirements = ?, companyName = ?, salary = ?, hideSalary = ? WHERE id = ?",
            [job.categoryId, job.title, job.level, job.location, job.remote, job.description, job.responsabilities, job.compensations, job.requirements, job.companyName, job.salary, job.hideSalary, job.id],
            function (err, result, fields) {
                if (err) throw err;
                res.send({ ...job })
            });
    });
})


router.get('/', (req, res) => {
    const con = connectDB()
    con.connect(function (err) {
        if (err) throw err;
        con.query("SELECT * FROM jobs", function (err, result, fields) {
            if (err) throw err;
            let jobs = result
            con.query("SELECT * FROM categories ", function (err, result, fields) {
                if (err) throw err;
                const categories = result
                jobs.map((job, index) => {
                    jobs[index].category = categories.find(c => c.id === job.categoryId)
                })
                res.send(jobs)
            });
        });
    });
})

router.get('/:id', (req, res) => {
    const con = connectDB()

    let job = {}
    con.connect(function (err) {
        if (err) throw err;
        con.query("SELECT * FROM jobs WHERE id = ?", [req.params['id']], function (err, result, fields) {
            if (err) throw err;
            job = { ...result[0] }
            job = {
                ...job,
                requirements: job?.requirements?.split(";"),
                compensations: job?.compensations?.split(";"),
                responsabilities: job?.responsabilities?.split(";")
            }
            con.query("SELECT * FROM categories WHERE id = ?", [job.categoryId], function (err, result, fields) {
                if (err) throw err;
                job.category = { ...result[0] }
                res.send(job)
            });
        });
    });
})

export default router