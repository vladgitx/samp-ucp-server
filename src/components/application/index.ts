export { Application, ApplicationAnswer } from "./public/types"
export {
    insertApplicationInDb,
    getAllApplications,
    getApplicationFromDb,
    deleteApplicationFromDb
} from "./data/orm"