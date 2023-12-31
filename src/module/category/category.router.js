import { Router } from "express";
import * as categoryController from './controller/category.controller.js';
import { auth } from "../../middleware/auth.js";
import { endpoints } from "./category.endpoint.js";
import * as validators from './category.validation.js';
import { validation } from "../../middleware/validation.js";
import subcategoryRouter from '../subcategory/subcategory.router.js';
const router= Router();
router.post('/',auth(endpoints.create),validation(validators.createCategorySchema),categoryController.createCategory);
router.put('/:categoryId',validation(validators.updateCategorySchema),auth(endpoints.update),categoryController.updateCategory);
router.get('/',auth(endpoints.get),categoryController.getCategory);
router.get('/:categoryId',auth(endpoints.get),validation(validators.getSpaceficCategorySchema),auth(endpoints.get),categoryController.getSpaceficCategory);
router.delete('/:categoryId',auth(endpoints.delete),validation(validators.deleteCategorySchema),categoryController.deleteCategory);
router.use('/:categoryId/subcategory',subcategoryRouter);
export default router;