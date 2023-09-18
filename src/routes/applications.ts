import express from "express"
import {
    ApplicationAnswer,
    deleteApplicationFromDb,
    getAllApplications,
    getApplicationFromDb,
    insertApplicationInDb
} from "../components/application"

export const router = express.Router()

router.post("/submit", async (req, res) => {
    const { email, answers }: { email: string, answers: ApplicationAnswer[] } = req.body

    if (typeof email !== "string" || !email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        return res.status(400).json(false)
    }
    if (answers === undefined || answers.length === 0) {
        return res.status(400).json(false)
    }
    for (let i = 0; i < answers.length; i++) {
        if (typeof answers[i].question !== "string" || typeof answers[i].answer !== "string") {
            return res.status(400).json(false)
        }
    }

    const inserted = await insertApplicationInDb(email, answers)
    if (!inserted) {
        return res.status(500).json(false)
    }
  
    res.status(200).json(true)
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
    res.status(200).json(application || "Could not find the application!")
})

router.delete("/:id", async (req, res) => {
    const deleted = await deleteApplicationFromDb(parseInt(req.params.id))
    if (!deleted) {
        return res.status(200).json(false)
    }
    res.status(200).json(true)
})