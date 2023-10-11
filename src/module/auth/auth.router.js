import { Router } from "express";
import * as authController from './controller/auth.controller.js';
import { validation } from "../../middleware/validation.js";
import * as validators from './auth.validation.js';
const router = Router();
router.post('/signup',validation(validators.signupSchema),authController.signup);
router.get('/confirmEmail/:token',validation(validators.token),authController.confirmEmail);
router.get('/newConfirmEmail/:token',validation(validators.token),authController.newConfirmEmail);
router.post('/signin',validation(validators.signinSchema),authController.signin);
router.patch('/sendCode',validation(validators.sendCodeSchema),authController.sendCode);
router.put('/forgetPassword',validation(validators.forgetPasswordSchema),authController.forgetPassword);
export default router;