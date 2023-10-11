import slugify from "slugify";
import subcategoryModel from "../../../../DB/model/subcategory.model.js";
import topicModel from "../../../../DB/model/topic.model.js";
import cloudinary from "../../../services/cloudinary.js";
import { asyncHandller } from "../../../services/errorHandling.js";
import courseModel from "../../../../DB/model/course.model.js";
import reviewModel from "../../../../DB/model/review.model.js";
import exerciseModel from "../../../../DB/model/exercise.model.js";
import exerciseSolutionModel from "../../../../DB/model/ExerxiseSolution.model.js";
export const createTopic =asyncHandller(async(req,res,next)=>{
    const name = req.body.name.toLowerCase();
    const{categoryId,subcategoryId}=req.params;
    if(!await subcategoryModel.findOne({_id:subcategoryId,categoryId})){
        return next(new Error(`Category or subcategory are not found`,{cause:404}));
    }
    if(await topicModel.findOne({name})){
        return next(new Error(`Duplicate topic name`,{cause:409}));
    }
    const{secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/topics`,resource_type:'image'});
    const topic = await topicModel.create({name,slug:slugify(name),categoryId,subcategoryId,image:{secure_url,public_id},createdBy:req.user._id,updatedBy:req.user._id});
    return res.status(201).json({message:"Success",topic});
});
export const updateTopic = asyncHandller(async(req,res,next)=>{
    const {categoryId,subcategoryId,topicId} = req.params;
    const topic = await topicModel.findOne({categoryId,subcategoryId,_id:topicId});
    if(!topic){
        return next(new Error(`topic not found`,{cause:404}));
    }
    if(req.body.name){
        const name = req.body.name.toLowerCase();
        if(await topicModel.findOne({name})){
            return next(new Error(`Duplicate topic`,{cause:409}));
        }
        if(topic.name == name){
            return next(new Error(`Old name match new name`,{cause:400}));
        }
        topic.name = name;
        topic.slug = slugify(name);
    }
    if(req.file){
        const {public_id,secure_url} = await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/topics`});
        await cloudinary.uploader.destroy(topic.image.public_id);
        topic.image ={public_id,secure_url};
    }
    topic.updatedBy = req.user._id;
    await topic.save();
    return res.status(200).json({message:"Success",topic});
});
export const getTopics = asyncHandller(async(req,res,next)=>{
    const {categoryId,subcategoryId}=req.params;
    const topics = await topicModel.find({categoryId,subcategoryId});
    if(topics.length==0){
        return next(new Error(`No topics found for this subcategory`));
    }
    return res.status(200).json({message:"Success",topics});
});
export const getSpecificTopic = asyncHandller(async(req,res,next)=>{
    const {categoryId,subcategoryId,topicId}=req.params;
    const topic = await topicModel.findOne({categoryId,subcategoryId,_id:topicId});
    if(!topic){
        return next(new Error(`Topic not found`,{cause:404}));
    }
    return res.status(200).json({message:"Success",topic});
});
export const deleteTopic = asyncHandller(async(req,res,next)=>{
    const {categoryId,subcategoryId,topicId}=req.params;
    let topic = await topicModel.findOne({categoryId,subcategoryId,_id:topicId});
    if(!topic){
        return next(new Error(`Topic not found`,{cause:404}));
    }
    topic = await topicModel.deleteOne({categoryId,subcategoryId,_id:topicId});
    let course = await courseModel.find({subcategoryId,categoryId,topicId}).select('_id');
    await courseModel.deleteMany({subcategoryId,categoryId,topicId});
    await reviewModel.deleteMany({courseId:{$in:course}});
    await exerciseModel.deleteMany({courseId:{$in:course}});
    await exerciseSolutionModel.deleteMany({courseId:{$in:course}});
    return res.status(200).json({message:"Success"}); 
});