import express from "express";
import connectDB from '../database/connection.js'


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