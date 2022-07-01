import express from "express";
import mysql from 'mysql';

const router = express.Router();

const users = [
    {
        "username": "LeFelps"
    }
]

router.get('/', (req, res) => {
    res.send(users)
})

export default router