import "dotenv/config"
import { Pool } from "pg"
import express from "express"
import cors from "cors"

import { applicationRouter } from "./components/application"

export const pool = new Pool({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_DB,
    password: process.env.DATABASE_PASSWORD,
})

const app = express()
const PORT = 3001

app.use(cors({ origin: "http://localhost:3000" }))
app.use(express.json())

app.use("/applications", applicationRouter)

app.listen(PORT)