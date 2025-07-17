import { Types } from "mongoose"
import { UserRole } from "./schema"


declare global {
    namespace Express {
        interface Request {
            user?: {
                id: Types.ObjectId|string,
                role: UserRole
                email: string
            }
        }
    }
}