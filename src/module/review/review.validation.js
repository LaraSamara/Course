import joi from 'joi';
import { generalFeild } from '../../middleware/validation.js';
export const createReviewSchema =joi.object({
    comment:joi.string().required(),
    rating:joi.number().positive().min(1).max(5).required(),
    courseId:generalFeild.id.required(),
    categoryId:generalFeild.id.required(),
    subcategoryId:generalFeild.id.required(),
    topicId:generalFeild.id.required()
}).required();
export const updateReviewSchema =joi.object({
    comment:joi.string(),
    rating:joi.number().positive().min(1).max(5),
    reviewId:generalFeild.id.required(),
    courseId:generalFeild.id.required(),
    categoryId:generalFeild.id.required(),
    subcategoryId:generalFeild.id.required(),
    topicId:generalFeild.id.required()
}).required();
export const deleteReviewSchema =joi.object({
    reviewId:generalFeild.id.required(),
    courseId:generalFeild.id.required(),
    categoryId:generalFeild.id.required(),
    subcategoryId:generalFeild.id.required(),
    topicId:generalFeild.id.required()
}).required();
export const likeReviewSchema =joi.object({
    reviewId:generalFeild.id.required(),
    courseId:generalFeild.id.required(),
    categoryId:generalFeild.id.required(),
    subcategoryId:generalFeild.id.required(),
    topicId:generalFeild.id.required()
}).required();
export const unLikeReviewSchema =joi.object({
    reviewId:generalFeild.id.required(),
    courseId:generalFeild.id.required(),
    categoryId:generalFeild.id.required(),
    subcategoryId:generalFeild.id.required(),
    topicId:generalFeild.id.required()
}).required();