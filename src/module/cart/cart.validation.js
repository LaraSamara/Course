import joi from 'joi';
import { generalFeild } from '../../middleware/validation.js';
export const addToCartSchema = joi.object({
    courseId:generalFeild.id.required()
}).required();
export const removeFromCartSchema = joi.object({
    courseId:generalFeild.id.required()
}).required();