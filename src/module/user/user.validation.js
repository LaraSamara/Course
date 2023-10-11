import joi from 'joi';
import { generalFeild } from '../../middleware/validation.js';
export const updateAdminStatueSchema = joi.object({
    userId:generalFeild.id.required(),
    status:joi.string().valid('Active','Not_Active').required()
}).required();
export const changeRoleSchema = joi.object({
    userId:generalFeild.id.required(),
    role:joi.string().valid('Admin','User').required()
}).required();
export const BlockUserSchema = joi.object({
    userId:generalFeild.id.required(),
}).required();
export const unBlockUserSchema = joi.object({
    userId:generalFeild.id.required(),
}).required();
export const updateInformationSchema = joi.object({
    email:joi.string().email(),
    userName:joi.string(),
    password:generalFeild.password,
    newPassword:joi.string(),
    confirmNewPassword:joi.string().valid(joi.ref('newPassword'))
}).required();