import bcrypt from "bcryptjs"
import express from "express"
import { getAccountLoginInfo, insertAccountToDb } from "../data/account"
import { isAuthenticated, isNotAuthenticated } from "./middleware"
import { appConfig } from "../../../common/config"

export const router = express.Router()

router.post("/register", isNotAuthenticated, (req, res) => {
    const { name, email, password }: { name: string, email: string, password: string } = req.body

    if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
        return res.status(400).json({ error: "Nume, email sau parola invalida." })
    }
    if (name.length < 3 || name.length > 20) {
        return res.status(400).json({ error: "Numele trebuie sa aiba intre 3 si 20 de caractere." })
    }
    if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        return res.status(400).json({ error: "Acel email este invalid." })
    }
    if (password.length < 8) {
        return res.status(400).json({ error: "Parola are mai putin de 8 caractere." })
    }

    bcrypt.hash(password, 10, async (error, hash) => {
        if (error) {
            console.error("Error while hashing password:", error)
            return res.status(500).json({ error: "Parola nu a putut fi criptata." })
        }

        const accountId = await insertAccountToDb(name, email, hash)
        if (accountId === undefined) {
            return res.status(500).json({ error: "Contul nu a putut fi creat." })
        }

        res.status(200).json({ accountId })
    })
})

router.post("/login", isNotAuthenticated, async (req, res) => {
    const { nameOrEmail, password }: { nameOrEmail: string, password: string } = req.body

    if (typeof nameOrEmail !== "string" || typeof password !== "string") {
        return res.status(400).json({ error: "Numele, emailul sau parola sunt invalide." })
    }

    const account = await getAccountLoginInfo(nameOrEmail)

    try {
        const match = await bcrypt.compare(account ? password : "a", account ? account.password : "b")
        if (!match) {
            return res.status(200).json({ error: "Numele, emailul sau parola sunt gresite." })
        }
        req.session.accountId = account!.id
        res.status(200).json({ accountId: account!.id })
    } catch (error) {
        console.error("Error while validating password:", error)
        return res.status(500).json({ error: "Ceva nu a mers bine." })
    }
})

router.delete("/logout", isAuthenticated, async (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            res.status(500).json({ error: "Ceva a mers prost." })
        } else {
            res.status(204).send()
        }
    })
})

router.get("/check", (req, res) => {
    console.log("Checking session:", req.session.id, "Authenticated:", req.session.accountId !== undefined)
    res.status(200).json({ authenticated: req.session.accountId !== undefined })
})

if (appConfig.environment === "development") {
    router.get("/dashboard", isAuthenticated, (req, res) => {
        res.send(`Your account ID: ${req.session.accountId}`)
    })
    
    router.get("/login", isNotAuthenticated, (req, res) => {
        req.session.accountId = 1
        res.send("You authenticated with account ID 1 now.")
    })
}