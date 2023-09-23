export function validateLimitAndSkip(limit: any, skip: any) {
    let limitNumber: number | undefined = undefined
    let skipNumber: number | undefined = undefined

    if (limit !== undefined) {
        if (typeof limit !== "string") {
            return undefined
        }
        if (isNaN(parseInt(limit))) {
            if (limit !== "null") {
                return undefined
            }
        }
        if (limit !== "null") {
            limitNumber = parseInt(limit)
        }
    }
    if (skip !== undefined) {
        if (typeof skip !== "string") {
            return undefined
        }
        if (isNaN(parseInt(skip))) {
            if (skip !== "null") {
                return undefined
            }
        }
        if (skip !== "null") {
            skipNumber = parseInt(skip)
        }
    }

    return {
        limit: limitNumber,
        skip: skipNumber,
    }
}