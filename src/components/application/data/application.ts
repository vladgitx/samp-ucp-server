import { pool } from "../../.."
import { ApplicationAnswer } from "../types/answer"
import { Application } from "../types/application"

export async function insertApplicationInDb(email: string, answers: ApplicationAnswer[]) {
    const client = await pool.connect()

    try {
        await client.query("BEGIN")

        const res = await client.query("INSERT INTO applications (email) VALUES ($1) RETURNING id", [email])
        const applicationId = res.rows[0].id

        for (let i = 0; i < answers.length; i++) {
            await client.query("INSERT INTO application_answers (application_id, question, answer) VALUES ($1, $2, $3)", [applicationId, answers[i].question, answers[i].answer])
        }
        await client.query("COMMIT")

        return true
    } catch (error) {
        await client.query("ROLLBACK")
        console.error("Error inserting application:", error)
        return false
    } finally {
        client.release()
    }
}

export async function getAllApplications(limit?: number, skip?: number): Promise<Application[]> {
    try {
        const res = await pool.query("SELECT id, date, email FROM applications ORDER BY date DESC LIMIT $1 OFFSET $2", [limit, skip])
        return res.rows.map((row) => {
            return {
                id: row.id,
                email: row.email,
                date: row.date,
            }
        })
    } catch (error) {
        console.error("Error when fetching all applications:", error)
        return []
    }
}

export async function getApplicationFromDb(applicationId: number): Promise<{ id: number, email: string, date: Date, answers: ApplicationAnswer[] } | undefined> {
    try {
        const res = await pool.query("SELECT aa.question, aa.answer, a.email, a.date FROM application_answers AS aa INNER JOIN applications AS a ON aa.application_id = a.id WHERE aa.application_id = $1", [applicationId])
        if (!res.rowCount) {
            return undefined
        }

        const answers: ApplicationAnswer[] = res.rows.map((row) => {
            return {
                question: row.question,
                answer: row.answer,
            }
        })
        
        return {
            id: applicationId,
            email: res.rows[0].email,
            date: res.rows[0].date,
            answers,
        }
    } catch (error) {
        console.error(`Error fetching application ${applicationId}:`, error)
        return undefined
    }
}

export async function deleteApplicationFromDb(applicationId: number) {
    try {
        const res = await pool.query("DELETE FROM applications WHERE id = $1", [applicationId])
        if (res.rowCount) {
            return true
        }
        return false
    } catch (error) {
        console.error(`Error deleting application ${applicationId}:`, error)
        return false
    }
}