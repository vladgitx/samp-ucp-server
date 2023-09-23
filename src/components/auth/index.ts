declare module "express-session" {
    interface SessionData {
        accountId?: number
    }
}

export { router as authRouter } from "./public/router"
export { isAuthenticated, isNotAuthenticated } from "./public/middleware"