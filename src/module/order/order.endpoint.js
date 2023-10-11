import { roles } from "../../middleware/auth.js";
export const endpoints = {
    create: [roles.user]
}