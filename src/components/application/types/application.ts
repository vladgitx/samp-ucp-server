export type Application = {
    id: number
    email: string
    date: Date
    status: "pending" | "accepted" | "rejected"
}