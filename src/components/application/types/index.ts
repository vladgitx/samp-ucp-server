export type Application = {
    id: number
    email: string
    date: Date
    status: "pending" | "accepted" | "rejected"
}

export type ApplicationAnswer = {
    question: string
    answer: string
}