import joi from 'joi';
import { generalFeild } from '../../middleware/validation.js';
export const createOrderSchema = joi.object({
    courses:joi.array().items({
        courseId:generalFeild.id.required()
    }).required(),
    address:joi.string().required(),
    couponName:joi.string(),
    phone:joi.string().required()
}).required();
export const addAllFromCartSchema = joi.object({
    address:joi.string().required(),
    couponName:joi.string(),
    phone:joi.string().required()
}).required();
export const orderNowSchema = joi.object({
    address:joi.string().required(),
    couponName:joi.string(),
    phone:joi.string().required(),
    courseId:generalFeild.id.required()
}).required();