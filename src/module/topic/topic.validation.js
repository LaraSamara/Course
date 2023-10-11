import joi from 'joi';
import { generalFeild } from '../../middleware/validation.js';
export const createTopicSchema=joi.object({
    name:joi.string().required(),
    file:generalFeild.file.required(),
    categoryId:generalFeild.id.required(),
    subcategoryId:generalFeild.id.required()
}).required();
export const updateTopicSchema=joi.object({
    categoryId:generalFeild.id.required(),
    subcategoryId:generalFeild.id.required(),
    topicId:generalFeild.id.required(),
    file:generalFeild.file,
    name:joi.string()
}).required();
export const getTopicsSchema=joi.object({
    categoryId:generalFeild.id.required(),
    subcategoryId:generalFeild.id.required()
}).required();
export const getSpecificTopicSchema=joi.object({
    categoryId:generalFeild.id.required(),
    subcategoryId:generalFeild.id.required(),
    topicId:generalFeild.id.required()
}).required();
export const deleteTopicSchema = joi.object({
    categoryId:generalFeild.id.required(),
    subcategoryId:generalFeild.id.required(),
    topicId:generalFeild.id.required()
}).required();