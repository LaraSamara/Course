import { roles } from "../../middleware/auth.js";
export const endpoints= {
    create:[roles.user],
    update:[roles.user],
    delete:[roles.user],
    like:[roles.user],
    unlike:[roles.user]
}