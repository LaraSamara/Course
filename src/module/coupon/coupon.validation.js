import joi from 'joi';
import { generalFeild } from '../../middleware/validation.js';
export const createCouponSchema = joi.object({
    name:joi.string().required(),
    amount:joi.number().positive().min(1).max(100).required(),
    expireDate:joi.string().required()
}).required();
export const updateCouponSchema = joi.object({
    expireDate:joi.string(),
    name:joi.string(),
    amount:joi.number().positive().min(1).max(100),
    couponId:generalFeild.id.required()
}).required();
export const getSpecificCouponSchema = joi.object({
    couponId:generalFeild.id.required()
}).required();