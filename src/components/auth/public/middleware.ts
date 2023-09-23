import { NextFunction, Request, Response } from "express"

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.session.accountId !== undefined) {
        next()
    } else {
        res.status(401).json({ error: "Nu esti logat." })
    }
}

export function isNotAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.session.accountId === undefined) {
        next()
    } else {
        res.status(401).json({ error: "Trebuie sa iesi din cont ca sa faci asta." })
    }
}