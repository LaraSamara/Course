import courseModel from "../../../../DB/model/course.model.js";
import orderModel from "../../../../DB/model/order.model.js";
import reviewModel from "../../../../DB/model/review.model.js";
import { asyncHandller } from "../../../services/errorHandling.js";
export const createReview =asyncHandller(async(req,res,next)=>{
    const{comment,rating}=req.body;
    const{courseId}=req.params;
    if(!await courseModel.findOne({_id:courseId,isDelete:false})){
        return next(new Error(`Course not found`,{cause:404}));
    }
    const order = await orderModel.findOne({userId:req.user._id,"courses.courseId":courseId});
    if(!order){
        return next(new Error(`cannot review before buying it `,{cause:400}));
    }
    if(await reviewModel.findOne({userId:req.user._id,courseId})){
        return next(new Error(`you already review`,{cause:400}));
    }
    const review = await reviewModel.create({comment,rating,courseId,userId:req.user._id});
    return res.status(201).json({message:"Success",review});

});
export const updateReview =asyncHandller(async(req,res,next)=>{
    const{reviewId,courseId}=req.params;
    if(!await courseModel.findOne({_id:courseId,isDelete:false})){
        return next(new Error(`Course not found`,{cause:404}));
    }
    let review = await reviewModel.findOne({_id:reviewId,userId:req.user._id});
    if(!review){
        return next(new Error(`Review not found`,{cause:404}));
    }
    review = await reviewModel.findByIdAndUpdate(reviewId,req.body,{new:true});
    return res.status(200).json({message:"Success",review});

});
export const deleteReview =asyncHandller(async(req,res,next)=>{
    const{reviewId,courseId}=req.params;
    if(!await courseModel.findOne({_id:courseId,isDelete:false})){
        return next(new Error(`Course not found`,{cause:404}));
    }
    const review = await reviewModel.findOneAndDelete({_id:reviewId,userId:req.user._id});
    if(!review){
        return next(new Error(`No review Found`,{cause:404}));
    }
    return res.status(200).json({message:"Success",review});
});
export const likeReview = asyncHandller(async(req,res,next)=>{
    const{reviewId,courseId}=req.params;
    if(!await courseModel.findOne({_id:courseId,isDelete:false})){
        return next(new Error(`Course not found`,{cause:404}));
    }
    if(!await reviewModel.findById(reviewId)){
        return next(new Error(`review not found`,{cause:404}));
    }
    const review = await reviewModel.findByIdAndUpdate(reviewId,{$addToSet:{like:req.user._id},$pull:{unLike:req.user._id}},{new:true});
    review.totalVote= review.like.length-review.unLike.length;
    await review.save();
    return res.status(200).json({message:"Success",review});

});
export const unLikeReview = asyncHandller(async(req,res,next)=>{
    const {reviewId,courseId}=req.params;
    if(!await courseModel.findOne({_id:courseId,isDelete:false})){
        return next(new Error(`Course not found`,{cause:404}));
    }
    if(!reviewModel.findById(reviewId)){
        return next(new Error(`Review not found`,{cause:404}));
    }
    const review = await reviewModel.findByIdAndUpdate(reviewId,{$addToSet:{unLike:req.user._id},$pull:{like:req.user._id}},{new:true});
    review.totalVote = review.like.length - review.unLike.length;
    await review.save();
    return res.status(200).json({message:"Success",review});
});