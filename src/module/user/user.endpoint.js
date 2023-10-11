import { roles } from "../../middleware/auth.js";
export const endpoints ={
    updateAdminStatue:[roles.super],
    changeRole:[roles.super],
    BlockUser:[roles.admin],
    unBlockUser:[roles.admin],
    updateInformation:[roles.user,roles.admin,roles.super]
}