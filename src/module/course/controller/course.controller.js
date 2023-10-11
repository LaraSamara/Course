import slugify from "slugify";
import courseModel from "../../../../DB/model/course.model.js";
import topicModel from "../../../../DB/model/topic.model.js";
import cloudinary from "../../../services/cloudinary.js";
import { asyncHandller } from "../../../services/errorHandling.js";
import reviewModel from "../../../../DB/model/review.model.js";
import exerciseModel from "../../../../DB/model/exercise.model.js";
import exerciseSolutionModel from "../../../../DB/model/ExerxiseSolution.model.js";
export const crateCourse = asyncHandller(async(req,res,next)=>{
    let name = req.body.name.toLowerCase();
    const{description,price,includes,learnAbout,courseContent,requirements}=req.body;
    const{categoryId,subcategoryId,topicId}=req.params;
    if(!await topicModel.findOne({categoryId,subcategoryId,_id:topicId})){
        return next(new Error(`Invalid topic id, subcategory id, or category id`),{cause:400});
    }
    if(await courseModel.findOne({name,topicId})){
        return next(new Error(`Duplicate course name`,{cause:409}));
    }
    const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/course`,resource_type:'video'});
    const course = await courseModel.create({name,slug:slugify(name),description,price,includes,learnAbout,courseContent,requirements,previewVideo:{secure_url,public_id},categoryId,subcategoryId,topicId,createdBy:req.user._id});
    return res.status(201).json({message:"Success",course});
});
export const updateCourse = asyncHandller(async(req,res,next)=>{
    const{courseId,categoryId,subcategoryId,topicId}=req.params;
    const course = await courseModel.findOne({_id:courseId,isDelete:false,categoryId,subcategoryId,topicId});
    if(!course){
        return next(new Error(`Course not found`,{cause:404}));
    }
    if(JSON.stringify(course.createdBy)!= JSON.stringify(req.user._id)){
        return next(new Error(`only one who created course can update it`));
    }
    let{name,description,price,includes,learnAbout,courseContent,requirements,category_id,subcategory_id,topic_id}=req.body
    if(req.file){
        const{secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/course`,resource_type:'video'});
        await cloudinary.uploader.destroy(course.previewVideo.public_id,{resource_type:"video"},(err, result) => {
            console.log(result);});
        course.previewVideo = {secure_url,public_id};
    }
    if(name){
        name = name.toLowerCase();
        if(await courseModel.findOne({name,topicId})){
            return next(new Error(`Duplicate name`,{cause:409}));
        }
        if(course.name==name){
            return next(new Error(`Old match new name`));
        }
        course.name = name;
        course.slug = slugify(name);
    }
    if(description){
        course.description=description;
    }
    if(price){
        course.price=price;
    }
    if(includes){
        course.includes=includes;
    }
    if(learnAbout){
        course.learnAbout=learnAbout;
    }
    if(courseContent){
        course.courseContent=courseContent;
    }
    if(requirements){
        course.requirements=requirements;
    }
    if(topic_id){
        const topic = await topicModel.findById(topic_id);
        if(!topic){
            return next(new Error(`Topic not found`,{cause:404}));
        }
        if(JSON.stringify(course.categoryId) != JSON.stringify(topic.categoryId) && JSON.stringify(course.subcategoryId)!=JSON.stringify(topic.subcategoryId)){
            return next(new Error(`this topic category or subcategory not match with the course caregory or subcategory`));
        }
        course.topicId =topic_id;
    }else if(subcategory_id && topic_id){
        const topic = await topicModel.findOne({_id:topic_id,subcategoryId:subcategory_id});
        if(!topic){
            return next(new Error(`Topic not found`,{cause:404}));
        }
        if(JSON.stringify(topic.categoryId) != JSON.stringify(course.categoryId)){
            return next(new Error(`this topic category not match course category`));
        }
    }else if(category_id && subcategory_id && topic_id){
        if(await topicModel.findOne({_id:topic_id,subcategoryId:subcategory_id,categoryId:category_id}));
    }
    course.isUpdated=true;
    await course.save();
    return res.status(200).json({message:"Success",course});
});
export const getCourse =asyncHandller((async(req,res,next)=>{
    const {topicId,categoryId,subcategoryId}=req.params;
    const courses = await courseModel.find({topicId,categoryId,subcategoryId,isDelete:false}).populate('review').populate(`exercise`);
    if(courses.length==0){
        return next(new Error(`No coursees found`,{cause:404}));
    }
    return res.status(200).json({message:"Success",courses});
}));
export const getSpecificCourse = asyncHandller(async(req,res,next)=>{
    const{categoryId,subcategoryId,topicId,courseId}=req.params;
    const course = await courseModel.findOne({categoryId,subcategoryId,topicId,_id:courseId,isDelete:false}).populate('review').populate('exercise');
    if(!course){
        return next(new Error(`No course found`,{cause:404}));
    }
    return res.status(200).json({message:"Success",course});
});
export const softDelete = asyncHandller(async(req,res,next)=>{
    const{courseId,categoryId,subcategoryId,topicId}=req.params;
    let course = await courseModel.findOne({_id:courseId,isDelete:false,categoryId,subcategoryId,topicId});
    if(!course){
        return next(new Error(`Course not found`,{cause:404}));
    }
    if(JSON.stringify(course.createdBy)!= JSON.stringify(req.user._id)){
        return next(new Error(`only one who created course can delete it`));
    }
    course.isDelete =true;
    await course.save();
    return res.status(200).json({message:"Success"});
    
});
export const forceDelete = asyncHandller(async(req,res,next)=>{
    const{courseId}=req.params;
    let course = await courseModel.findOne({_id:courseId,isDelete:true});
    if(!course){
        return next(new Error(`Course not found`,{cause:404}));
    }
    if(JSON.stringify(course.createdBy)!= JSON.stringify(req.user._id)){
        return next(new Error(`only one who created course can delete it`));
    }
    course = await courseModel.deleteOne({_id:courseId,isDelete:true});
    await reviewModel.deleteMany({courseId});
    await exerciseModel.deleteMany({courseId});
    await exerciseSolutionModel.deleteMany({courseId});
    return res.status(200).json({message:"Success",course});
});
export const getSoftDelete = asyncHandller(async(req,res,next)=>{
    const {topicId,categoryId,subcategoryId}=req.params;
    const courses = await courseModel.find({topicId,categoryId,subcategoryId,isDelete:true,createdBy:req.user._id}).populate('review').populate('exercise');
    if(courses.length==0){
        return next(new Error(`No course found`));
    }
    return res.status(200).json({message:"Success",courses});
});
export const restore = asyncHandller(async(req,res,next)=>{
    const {courseId,categoryId,subcategoryId,topicId}=req.params;
    let course = await courseModel.findOne({_id:courseId,isDelete:true,categoryId,subcategoryId,topicId});
    if(!course){
        return next(new Error(`Course not found`,{cause:404}));
    }
    if(JSON.stringify(course.createdBy)!= JSON.stringify(req.user._id)){
        return next(new Error(`only one who created course can restore it`));
    }
    course = await courseModel.updateOne({_id:courseId,categoryId,subcategoryId,topicId},{isDelete:false});
    return res.status(200).json({message:"Success"});
});