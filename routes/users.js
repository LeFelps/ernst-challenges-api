import express from "express";

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