import { roles } from "../../middleware/auth.js";

export const endpoints ={
    create:[roles.admin],
    update:[roles.admin],
    get:[roles.admin,roles.user]
}