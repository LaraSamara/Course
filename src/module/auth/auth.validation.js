import joi from 'joi';
import { generalFeild } from '../../middleware/validation.js';
export const signupSchema =joi.object({
    email:generalFeild.email,
    userName:joi.string().required(),
    password:generalFeild.password,
    confirmPassword:generalFeild.password.valid(joi.ref('password'))
}).required();
export const token =joi.object({
    token:joi.string().required()
}).required();
export const signinSchema =joi.object({
    email:generalFeild.email,
    password:generalFeild.password
}).required();
export const sendCodeSchema =joi.object({
    email:generalFeild.email
}).required();
export const forgetPasswordSchema =joi.object({
    email:generalFeild.email,
    password:generalFeild.password,
    confirmPassword:generalFeild.password.valid(joi.ref('password')),
    code:joi.string().required()
}).required();