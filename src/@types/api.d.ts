import { UserRole } from "./schema";

export interface IUserInput {
    name: string;
    email: string;
    password: string;
    role:UserRole
}
