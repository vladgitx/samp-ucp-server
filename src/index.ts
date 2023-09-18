import express from "express"
import cors from "cors"

import { router as userRouter } from "./routes/applications"

const app = express()
const PORT = 3001

app.use(cors({ origin: "http://localhost:3000" }))
app.use(express.json())
app.use("/applications", userRouter)

app.listen(PORT)