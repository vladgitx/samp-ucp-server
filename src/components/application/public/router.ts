import express from "express"
import { ApplicationAnswer } from "../types/answer"
import {
    deleteApplicationFromDb,
    getAllApplications,
    getAllPendingApplications,
    getAllRespondedApplications,
    getApplicationFromDb,
    insertApplicationInDb,
    updateApplicationStatusInDb
} from "../data/application"
import { validateLimitAndSkip } from "../utils/validate-limit-skip"

export const router = express.Router()

router.post("/submit", async (req, res) => {
    const { email, answers }: { email: string, answers: ApplicationAnswer[] } = req.body

    if (typeof email !== "string" || !email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        return res.status(400).json({ error: "Acel email este invalid." })
    }
    if (answers === undefined || answers.length === 0) {
        return res.status(400).json({ error: "Raspunsurile tale la intrebari nu au fost gasite." })
    }
    for (let i = 0; i < answers.length; i++) {
        if (typeof answers[i].question !== "string" || typeof answers[i].answer !== "string") {
            return res.status(400).json({ error: "Ceva a mers prost in procesarea raspunsurilor de la intrebari." })
        }
    }

    const inserted = await insertApplicationInDb(email, answers)
    if (!inserted) {
        return res.status(500).json({ error: "Aplicatia ta nu a putut fi trimisa." })
    }
  
    res.status(200)
})

router.get("/all", async (req, res) => {
    const { limit, skip } = req.query

    const validated = validateLimitAndSkip(limit, skip)
    if (!validated) {
        return res.status(400).json({ error: "Invalid \"limit\" and \"skip\" query." })
    }

    const applications = await getAllApplications(validated.limit, validated.skip)
    res.status(200).json(applications)
})

router.get("/pending", async (req, res) => {
    const { limit, skip } = req.query

    const validated = validateLimitAndSkip(limit, skip)
    if (!validated) {
        return res.status(400).json({ error: "Invalid \"limit\" and \"skip\" query." })
    }

    const applications = await getAllPendingApplications(validated.limit, validated.skip)
    res.status(200).json(applications)
})

router.get("/answered", async (req, res) => {
    const { limit, skip } = req.query

    const validated = validateLimitAndSkip(limit, skip)
    if (!validated) {
        return res.status(400).json({ error: "Invalid \"limit\" and \"skip\" query." })
    }

    const applications = await getAllRespondedApplications(validated.limit, validated.skip)
    res.status(200).json(applications)
})

router
    .get("/:id", async (req, res) => {
        const application = await getApplicationFromDb(parseInt(req.params.id))
        if (!application) {
            return res.status(404).json({ error: "Aplicatia nu a fost gasita." })
        }
        res.status(200).json(application)
    })
    .delete("/:id", async (req, res) => {
        const deleted = await deleteApplicationFromDb(parseInt(req.params.id))
        if (!deleted) {
            return res.status(404).json({ error: "Aplicatia nu a fost gasita." })
        }
        res.status(200)
    })
    .patch("/:id", async (req, res) => {
        const { response } = req.query

        if (response !== "accepted" && response !== "rejected") {
            return res.status(400).json({ error: "Invalid query, it only accepts \"accepted\" and \"rejected\"." })
        }

        const application = await updateApplicationStatusInDb(parseInt(req.params.id), response)
        if (!application) {
            return res.status(404).json({ error: "Aplicatia nu a fost gasita." })
        }
        
        res.status(200).json(application)
    })