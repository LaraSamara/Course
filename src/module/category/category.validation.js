import joi from 'joi';
import { generalFeild } from '../../middleware/validation.js';
export const createCategorySchema = joi.object({
    name:joi.string().required()
}).required();
export const updateCategorySchema = joi.object({
    name:joi.string(),
    categoryId:generalFeild.id.required()
}).required();
export const getSpaceficCategorySchema = joi.object({
    categoryId:generalFeild.id.required()
}).required();
export const deleteCategorySchema = joi.object({
    categoryId:generalFeild.id.required()
}).required();