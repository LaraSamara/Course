import joi from'joi';
import { generalFeild } from '../../middleware/validation.js';
export const crateCourseSchema = joi.object({
    file:generalFeild.file.required(),
    name:joi.string().required(),
    description:joi.string().required(),
    price:joi.number().positive().required(),
    includes:joi.string().required(),
    learnAbout:joi.string().required(),
    courseContent:joi.string().required(),
    requirements:joi.string().required(),
    categoryId:generalFeild.id.required(),
    subcategoryId:generalFeild.id.required(),
    topicId:generalFeild.id.required()
}).required();
export const updateCourseSchema = joi.object({
    file:generalFeild.file,
    name:joi.string(),
    description:joi.string(),
    price:joi.number().positive(),
    includes:joi.string(),
    learnAbout:joi.string(),
    courseContent:joi.string(),
    requirements:joi.string(),
    categoryId:generalFeild.id.required(),
    subcategoryId:generalFeild.id.required(),
    topicId:generalFeild.id.required(),
    courseId:generalFeild.id.required(),
    category_id:generalFeild.id,
    subcategory_id:generalFeild.id,
    topic_id:generalFeild.id,
}).required();
export const getCourseSchema = joi.object({
    topicId:generalFeild.id.required(),
    categoryId:generalFeild.id.required(),
    subcategoryId:generalFeild.id.required()
}).required();
export const getSpecificCourseSchema = joi.object({
    topicId:generalFeild.id.required(),
    categoryId:generalFeild.id.required(),
    subcategoryId:generalFeild.id.required(),
    courseId:generalFeild.id.required()
}).required();
export const softDeleteSchema = joi.object({
    courseId:generalFeild.id.required(),
    topicId:generalFeild.id.required(),
    categoryId:generalFeild.id.required(),
    subcategoryId:generalFeild.id.required(),
}).required();
export const forceDeleteSchema = joi.object({
    courseId:generalFeild.id.required(),
    topicId:generalFeild.id.required(),
    categoryId:generalFeild.id.required(),
    subcategoryId:generalFeild.id.required(),
}).required();
export const getSoftDeleteSchema = joi.object({
    topicId:generalFeild.id.required(),
    categoryId:generalFeild.id.required(),
    subcategoryId:generalFeild.id.required(),
}).required();
export const restoreSchema = joi.object({
    courseId:generalFeild.id.required(),
    topicId:generalFeild.id.required(),
    categoryId:generalFeild.id.required(),
    subcategoryId:generalFeild.id.required(),
}).required();