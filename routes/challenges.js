import express from "express";
import connectDB from "../database/connection";

const router = express.Router();


router.get('/', (req, res) => {
    const con = connectDB()
    con.connect(function (err) {
        if (err) throw err;
        con.query("SELECT * FROM challenges", function (err, result, fields) {
            if (err) throw err;
            res.send(result)
        });
    });
    res.send(users)
})

export default router