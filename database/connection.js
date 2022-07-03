import mysql from 'mysql'
import 'dotenv/config'

const connectDB = () => {
    return mysql.createConnection({
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: 'koalify'
    });
}

export default connectDB