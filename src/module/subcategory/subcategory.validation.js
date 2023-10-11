import joi from "joi";
import { generalFeild } from "../../middleware/validation.js";
export const createSubCategorySchema =joi.object({
    name:joi.string().required(),
    categoryId:generalFeild.id.required()
}).required();
export const updateSubcategorySchema =joi.object({
    name:joi.string(),
    categoryId:generalFeild.id.required(),
    subcategoryId:generalFeild.id.required()
}).required();
export const getSubcategoriesSchema =joi.object({
    categoryId:generalFeild.id.required()
}).required();
export const getSpeceficCategorySchema =joi.object({
    subcategoryId:generalFeild.id.required(),
    categoryId:generalFeild.id.required()
}).required();
export const deleteSubcategorySchema =joi.object({
    subcategoryId:generalFeild.id.required(),
    categoryId:generalFeild.id.required()
}).required();