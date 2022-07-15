import express from 'express'
import bodyParser from 'body-parser'
import 'dotenv/config'

import connectDB from './database/connection.js'

import usersRoutes from './routes/users.js'
import challengesRoutes from './routes/challenges.js'
import jobsRoutes from './routes/jobs.js'
import opponentsRoutes from './routes/opponents.js'



const app = express();
const PORT = 5000;

app.use(bodyParser.json())

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});

app.use('/users', usersRoutes)
app.use('/challenges', challengesRoutes)
app.use('/jobs', jobsRoutes)
app.use('/opponents', opponentsRoutes)



app.get('/', (req, res) => {
});


app.listen(PORT, () => console.log(`Server running on PORT: http://localhost:${PORT}`))