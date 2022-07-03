import express from "express";
import connectDB from "../database/connection";

const router = express.Router();


router.get('/', (req, res) => {
    res.send(users)
})

export default router