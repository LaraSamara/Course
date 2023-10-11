import joi from 'joi';
import { generalFeild } from '../../middleware/validation.js';
export const createExerciseSchema = joi.object({
    name:joi.string().required(),
    text:joi.string().required(),
    solutionType:joi.string().required(),
    courseId:generalFeild.id.required(),
    topicId:generalFeild.id.required(),
    categoryId:generalFeild.id.required(),
    subcategoryId:generalFeild.id.required(),
    file:generalFeild.file
}).required();
export const updateExerciseSchema = joi.object({
    name:joi.string(),
    text:joi.string(),
    solutionType:joi.string(),
    exerciseId:generalFeild.id.required(),
    courseId:generalFeild.id.required(),
    topicId:generalFeild.id.required(),
    categoryId:generalFeild.id.required(),
    subcategoryId:generalFeild.id.required(),
    file:generalFeild.file
}).required();
export const deleteExerciseSchema = joi.object({
    exerciseId:generalFeild.id.required(),
    courseId:generalFeild.id.required(),
    topicId:generalFeild.id.required(),
    categoryId:generalFeild.id.required(),
    subcategoryId:generalFeild.id.required(),
}).required();
export const getExerciseSchema = joi.object({
    courseId:generalFeild.id.required(),
    topicId:generalFeild.id.required(),
    categoryId:generalFeild.id.required(),
    subcategoryId:generalFeild.id.required(),
}).required();
export const getSpecificExerciseSchema = joi.object({
    exerciseId:generalFeild.id.required(),
    courseId:generalFeild.id.required(),
    topicId:generalFeild.id.required(),
    categoryId:generalFeild.id.required(),
    subcategoryId:generalFeild.id.required(),
}).required();