import couponModel from "../../../../DB/model/coupon.model.js";
import { asyncHandller } from "../../../services/errorHandling.js";
export const createCoupon = asyncHandller(async(req,res,next)=>{
    let{name,amount,expireDate}=req.body;
    name= name.toLowerCase();
    if (await couponModel.findOne({name})){
        return next(new Error(`Duplicate coupon name`,{cause:409}));
    }
    const now = new Date();
    const date = new Date(expireDate);
    if(now.getTime() >= date.getTime()){
        return next(new Error(`Invalid expire date`,{cause:400}));
    }
    const coupon = await couponModel.create({name,amount,createdBy:req.user._id,updatedBy:req.user._id,expireDate:date.toLocaleDateString()});
    return res.status(201).json({message:"Success",coupon});
});
export const updateCoupon = asyncHandller(async(req,res,next)=>{
    let {expireDate,name,amount}=req.body;
    const {couponId} = req.params;
    const coupon = await couponModel.findById(couponId);
    if(!coupon){
        return next(new Error(`Coupon not found`,{cause:404}));
    }
    if(name){
        name = name.toLowerCase();
        if(await couponModel.findOne({name})){
            return next(new Error(`Duplicate coupon name`,{cause:409}));
        }
        if(coupon.name==name){
            return next(new Error(`New name match old name`,{cause:400}));
        }
        coupon.name = name;
    }
    if(amount){
        coupon.amount=amount;
    }
    if(expireDate){
        const now = new Date();
        const date = new Date(expireDate);
        if(now.getTime()>=date.getTime()){
            return next(new Error(`Invalid expire date`));
        }
        if(coupon.expireDate == date.toLocaleDateString()){
            return next(new Error(`New Expire date match the old one`,{cause:400}));
        }
        coupon.expireDate = date.toLocaleDateString();
    }
    coupon.updatedBy = req.user._id;
    await coupon.save();
    return res.status(200).json({message:"success",coupon});
});
export const getCoupons = asyncHandller(async(req,res,next)=>{
    const coupons = await couponModel.find({});
    if(coupons.length==0){
        return next(new Error(`No coupon found`));
    }
    return res.status(200).json({message:"Success",coupons});
});
export const getSpecificCoupon = asyncHandller(async(req,res,next)=>{
    const {couponId}=req.params;
    const coupon = await couponModel.findById(couponId);
    if(!coupon){
        return next(new Error(`Coupon not found`,{cause:404}));
    }
    return res.status(200).json({message:"Success",coupon});
});