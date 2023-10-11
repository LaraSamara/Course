import joi from 'joi';
import { generalFeild } from '../../middleware/validation.js';
export const createSolutionSchema = joi.object({
    exerciseId:generalFeild.id.required(),
    courseId:generalFeild.id.required(),
    topicId:generalFeild.id.required(),
    categoryId:generalFeild.id.required(),
    subcategoryId:generalFeild.id.required(),
    text:joi.string(),
    file:generalFeild.file
}).required();
export const updateSolutionSchema = joi.object({
    exerciseId:generalFeild.id.required(),
    courseId:generalFeild.id.required(),
    topicId:generalFeild.id.required(),
    categoryId:generalFeild.id.required(),
    subcategoryId:generalFeild.id.required(),
    solutionId:generalFeild.id.required(),
    text:joi.string(),
    file:generalFeild.file,
}).required();
export const deleteSolutionSchema = joi.object({
    exerciseId:generalFeild.id.required(),
    courseId:generalFeild.id.required(),
    topicId:generalFeild.id.required(),
    categoryId:generalFeild.id.required(),
    subcategoryId:generalFeild.id.required(),
    solutionId:generalFeild.id.required(),
}).required();
export const getSolutionsSchema = joi.object({
    exerciseId:generalFeild.id.required(),
    courseId:generalFeild.id.required(),
    topicId:generalFeild.id.required(),
    categoryId:generalFeild.id.required(),
    subcategoryId:generalFeild.id.required(),
}).required();
export const getSpecificSolutionSchema = joi.object({
    exerciseId:generalFeild.id.required(),
    courseId:generalFeild.id.required(),
    topicId:generalFeild.id.required(),
    categoryId:generalFeild.id.required(),
    subcategoryId:generalFeild.id.required(),
    solutionId:generalFeild.id.required(),
}).required();
export const markSolutionSchema = joi.object({
    exerciseId:generalFeild.id.required(),
    courseId:generalFeild.id.required(),
    topicId:generalFeild.id.required(),
    categoryId:generalFeild.id.required(),
    subcategoryId:generalFeild.id.required(),
    solutionId:generalFeild.id.required(),
    mark:joi.number().positive().min(0).max(100).required(),
    note:joi.string()
}).required();
export const updateMarkSchema = joi.object({
    exerciseId:generalFeild.id.required(),
    courseId:generalFeild.id.required(),
    topicId:generalFeild.id.required(),
    categoryId:generalFeild.id.required(),
    subcategoryId:generalFeild.id.required(),
    solutionId:generalFeild.id.required(),
    mark:joi.number().positive().min(0).max(100).required(),
    note:joi.string()
}).required();
