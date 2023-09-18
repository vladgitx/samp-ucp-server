import express from "express"
import { router as userRouter } from "./routes/applications"

const app = express()
const PORT = 3000

app.use(express.json())
app.use("/applications", userRouter)

app.listen(PORT)