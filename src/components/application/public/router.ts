import express from "express"
import { ApplicationAnswer } from "../types/answer"
import {
    deleteApplicationFromDb,
    getAllApplications,
    getApplicationFromDb,
    insertApplicationInDb
} from "../data/application"

export const router = express.Router()

router.post("/submit", async (req, res) => {
    const { email, answers }: { email: string, answers: ApplicationAnswer[] } = req.body

    if (typeof email !== "string" || !email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        return res.status(400).json({ success: false, message: "Acel email este invalid." })
    }
    if (answers === undefined || answers.length === 0) {
        return res.status(400).json({ success: false, message: "Raspunsurile tale la intrebari nu au fost gasite." })
    }
    for (let i = 0; i < answers.length; i++) {
        if (typeof answers[i].question !== "string" || typeof answers[i].answer !== "string") {
            return res.status(400).json({ success: false, message: "Ceva a mers prost in procesarea raspunsurilor de la intrebari." })
        }
    }

    const inserted = await insertApplicationInDb(email, answers)
    if (!inserted) {
        return res.status(500).json({ success: false, message: "Aplicatia ta nu a putut fi trimisa." })
    }
  
    res.status(200).json({ success: true })
})

router.get("/all", async (req, res) => {
    const { limit, skip } = req.query

    let limitNumber: number | undefined = undefined
    let skipNumber: number | undefined = undefined

    if (limit !== undefined) {
        if (typeof limit !== "string") {
            return res.status(400).json([])
        }
        if (isNaN(parseInt(limit))) {
            if (limit !== "null") {
                return res.status(400).json([])
            }
        }
        if (limit !== "null") {
            limitNumber = parseInt(limit)
        }
    }
    if (skip !== undefined) {
        if (typeof skip !== "string") {
            return res.status(400).json([])
        }
        if (isNaN(parseInt(skip))) {
            if (skip !== "null") {
                return res.status(400).json([])
            }
        }
        if (skip !== "null") {
            skipNumber = parseInt(skip)
        }
    }

    const applications = await getAllApplications(limitNumber, skipNumber)
    res.status(200).json(applications)
})

router.get("/:id", async (req, res) => {
    const application = await getApplicationFromDb(parseInt(req.params.id))
    res.status(200).json(application)
})

router.delete("/:id", async (req, res) => {
    const deleted = await deleteApplicationFromDb(parseInt(req.params.id))
    if (!deleted) {
        return res.status(200).json({ success: false, message: "Acel cont nu exista in baza de date." })
    }
    res.status(200).json({ success: true })
})