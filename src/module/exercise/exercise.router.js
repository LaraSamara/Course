import { Router } from "express";
import * as exerciseController from './controller/exercise.controller.js';
import { auth } from "../../middleware/auth.js";
import { endpoints } from "./exercise.endpoint.js";
import { fileUpload, fileValidation } from "../../services/multer.js";
import { validation } from "../../middleware/validation.js";
import * as validators from './exercies.validation.js';
import solutionrouter from '../exerciseSolution/exerciseSolution.router.js';
const router =Router({mergeParams:true});
router.post('/',auth(endpoints.create),fileUpload(fileValidation.file).single('file'),validation(validators.createExerciseSchema),exerciseController.createExercise);
router.put('/:exerciseId',auth(endpoints.update),fileUpload(fileValidation.file).single('file'),validation(validators.updateExerciseSchema),exerciseController.updateExercise);
router.delete('/:exerciseId',auth(endpoints.delete),validation(validators.deleteExerciseSchema),exerciseController.deleteExercise);
router.get('/',auth(endpoints.get),validation(validators.getExerciseSchema),exerciseController.getExercise);
router.get('/:exerciseId',auth(endpoints.get),validation(validators.getSpecificExerciseSchema),exerciseController.getSpecificExercise);
router.use('/:exerciseId/solution',solutionrouter)
export default router;