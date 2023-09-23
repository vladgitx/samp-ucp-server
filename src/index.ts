import { Pool } from "pg"
import express from "express"
import session from "express-session"
import cors from "cors"
import connectPgSimple from "connect-pg-simple"
import { applicationRouter } from "./components/application"
import { authRouter } from "./components/auth"
import { appConfig } from "./common/config"

export const pool = new Pool({
    user: appConfig.database.user,
    host: appConfig.database.host,
    database: appConfig.database.database,
    password: appConfig.database.password,
})

export const app = express()

app.use(cors({ origin: appConfig.clientUrl, credentials: true }))
app.use(express.json())
app.use(session({
    secret: appConfig.sessionSecretKey,
    store: new (connectPgSimple(session))({ pool }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: appConfig.cookieMaxAge,
        sameSite: "none",
        httpOnly: true,
        secure: appConfig.environment === "production" ? true : false,
    },
}))

app.use("/applications", applicationRouter)
app.use("/auth", authRouter)

app.listen(appConfig.port)