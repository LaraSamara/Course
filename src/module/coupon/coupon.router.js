import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import * as validators from './coupon.validation.js';
import * as couponController from './controller/coupon.controller.js';
import { validation } from "../../middleware/validation.js";
import { endpoints } from "./coupon.endpoint.js";
const router = Router();
router.post('/',auth(endpoints.create),validation(validators.createCouponSchema),couponController.createCoupon);
router.put('/:couponId',auth(endpoints.update),validation(validators.updateCouponSchema),couponController.updateCoupon);
router.get('/',auth(endpoints.get),couponController.getCoupons);
router.get('/:couponId',auth(endpoints.get),couponController.getSpecificCoupon)
export default router;