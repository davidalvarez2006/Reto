import express from 'express'
import { createPool} from 'mysql2/promise'
import {config} from 'dotenv'
config()

const app = express()

const pool = createPool({
    host: process.env.MYSQLDB_HOST,
    user: 'root',
    password: process.env.MYSQLDB_ROOT_PASSWORD,
    database: 'retodb',
    port: process.env.MYSQLDB_DOCKER_PORT,
})

app.get('/', (req, res) => {
    res.send('Hello Worlddd')
})

app.get('/ping', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT NOW()')
        res.json(rows)
    } catch (err) {
        console.error('DB error:', err)
        res.status(500).json({ error: err.message })
    }
})

app.listen(process.env.NODE_DOCKER_PORT)
console.log('Server on port', process.env.NODE_DOCKER_PORT)
