import express from 'express'
import bodyParser from 'body-parser'
import 'dotenv/config'

import connectDB from './database/connection.js'

import usersRoutes from './routes/users.js'

import mysql from 'mysql'

const app = express();
const PORT = 5000;

app.use(bodyParser.json())

app.use('/users', usersRoutes)

const con = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'koalify'
});


app.get('/', (req, res) => {
    con.connect(function (err) {
        if (err) throw err;
        con.query("SELECT * FROM categories", function (err, result, fields) {
            if (err) throw err;
            console.log(result);
        });
    });
});


app.listen(PORT, () => console.log(`Server running on PORT: http://localhost:${PORT}`))