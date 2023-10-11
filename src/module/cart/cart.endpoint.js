import { roles } from "../../middleware/auth.js";
export const endpoints = {
    addToCart:[roles.user],
    remove:[roles.user],
    clear:[roles.user],
    get:[roles.user]
}