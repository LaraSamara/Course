import cartModel from "../../../../DB/model/cart.model.js";
import courseModel from "../../../../DB/model/course.model.js";
import { asyncHandller } from "../../../services/errorHandling.js";
export const addToCart = asyncHandller(async(req,res,next)=>{
    const{courseId}=req.body
    const course = await courseModel.findOne({_id:courseId,isDelete:false});
    if(!course){
        return next(new Error(`Course not found`,{cause:404}));
    }
    let cart = await cartModel.findOne({userId:req.user._id});
    if(!cart){
        cart = await cartModel.create({courses:{courseId,courseName:course.name},userId:req.user._id});
        return res.status(201).json({message:"Success",cart});
    }
    cart.courses.addToSet({courseId,courseName:course.name});
    await cart.save();
    return res.status(200).json({message:"Success",cart});
    
});
export const removeFromCart = asyncHandller(async(req,res,next)=>{
    const{courseId}=req.body;
    const course = await courseModel.findOne({_id:courseId,isDelete:false});
    if(!course){
        return next(new Error(`course not found`));
    }
    const cart = await cartModel.findOne({userId:req.user._id,"courses.courseId":courseId});
    if(!cart){
        return next(new Error(`Course not found in your cart`));
    }
    cart.courses.pull({courseId});
    await cart.save();
    return res.status(200).json({message:"Success"});
});
export const clearCart = asyncHandller(async(req,res,next)=>{
    const cart = await cartModel.updateOne({userId:req.user._id},{courses:[]});
    return res.status(200).json({message:"Success"});
});
export const getCart = asyncHandller(async(req,res,next)=>{
    const cart = await cartModel.findOne({userId:req.user._id});
    if(!cart){
        return next(new Error(`No cart found`,{cause:404}));
    }
    return res.status(200).json({message:"Success",cart});
});