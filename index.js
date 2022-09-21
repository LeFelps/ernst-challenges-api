import express from 'express'
import bodyParser from 'body-parser'
import 'dotenv/config'

import usersRoutes from './routes/users.js'
import challengesRoutes from './routes/challenges.js'
import jobsRoutes from './routes/jobs.js'
import opponentsRoutes from './routes/opponents.js'
import jobApplicationRoutes from './routes/job-applications.js'
import challengeSubmissionsRoutes from './routes/challenge-submissions.js'
import categoriesRoutes from './routes/categories.js'

const app = express();
const PORT = 5000;

app.use(bodyParser.json())

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});

app.use('/categories', categoriesRoutes)
app.use('/challenge-submissions', challengeSubmissionsRoutes)
app.use('/challenges', challengesRoutes)
app.use('/job-applications', jobApplicationRoutes)
app.use('/jobs', jobsRoutes)
app.use('/opponents', opponentsRoutes)
app.use('/users', usersRoutes)

app.listen(PORT, () => console.log(`Server running on PORT: http://localhost:${PORT}`))