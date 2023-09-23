import { pool } from "../../.."

export async function insertAccountToDb(name: string, email: string, password: string) {
    try {
        const res = await pool.query("INSERT INTO accounts (name, email, password) VALUES ($1, $2, $3) RETURNING id", [name, email, password])
        return res.rows[0].id as number
    } catch (error) {
        console.error("Error while inserting account to database:", error)
        return undefined
    }
}

export async function getAccountLoginInfo(nameOrEmail: string) {
    try {
        const res = await pool.query("SELECT id, name, email, password FROM accounts WHERE name = $1 OR email = $2", [nameOrEmail, nameOrEmail])
        if (!res.rowCount) {
            return undefined
        }
        const row = res.rows[0]

        return {
            id: row.id as number,
            name: row.name as string,
            email: row.email as string,
            password: row.password as string,
        }
    } catch (error) {
        console.error(`Error while getting account login info for "${nameOrEmail}":`, error)
        return undefined
    }
}