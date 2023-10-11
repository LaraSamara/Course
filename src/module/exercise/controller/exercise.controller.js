import exerciseSolutionModel from "../../../../DB/model/ExerxiseSolution.model.js";
import courseModel from "../../../../DB/model/course.model.js";
import exerciseModel from "../../../../DB/model/exercise.model.js";
import cloudinary from "../../../services/cloudinary.js";
import { asyncHandller } from "../../../services/errorHandling.js";
export const createExercise =asyncHandller(async(req,res,next)=>{
    let {name,text,solutionType}=req.body;
    const{categoryId,subcategoryId,topicId,courseId}=req.params;
    name=name.toLowerCase();
    const course =await courseModel.findOne({_id:courseId,isDelete:false,categoryId,subcategoryId,topicId});
    if(!course){
        return next(new Error(`Course not found`,{cause:404}));
    }
    if(JSON.stringify(course.createdBy)!=JSON.stringify(req.user._id)){
        return next(new Error(`Only the owner of the course can creat the exercise`));
    }
    let exercise = await exerciseModel.findOne({name,courseId});
    if(exercise){
        return next(new Error(`Duplicate exercise name of this course`));
    }
    if(req.file){
        const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/course/${courseId}/exercise`});
        req.body.file ={secure_url,public_id};
    }
    exercise = await exerciseModel.create({name,courseId,text,solutionType,file:req.body.file,createdBy:req.user._id});
    return res.status(201).json({message:"Success",exercise});
});
export const updateExercise = asyncHandller(async(req,res,next)=>{
    let{name,text,solutionType}=req.body;
    const {categoryId,subcategoryId,topicId,courseId,exerciseId}=req.params;
    const course =await courseModel.findOne({_id:courseId,isDelete:false,categoryId,subcategoryId,topicId});
    if(!course){
        return next(new Error(`Course not found`,{cause:404}));
    }
    const exercise=await exerciseModel.findOne({_id:exerciseId,courseId});
    if(!exercise){
        return next(new Error(`exercise not found`,{cause:404}));
    }
    if(JSON.stringify(course.createdBy)!=JSON.stringify(req.user._id)){
        return next(new Error(`only one who created exercise can update it`));
    }
    if(name){
        name = name.toLowerCase();
        if(exercise.name==name){
            return next(new Error(`old name match new`,{cause:400}));
        }
        if(await exerciseModel.findOne({name,courseId})){
            return next(new Error(`Duplicate exercise`));
        }
        exercise.name=name;
    }
    if(text){
        exercise.text=text;
    }
    if(req.file){
        const {secure_url,public_id}= await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/course/${courseId}/exercise`});
        if(exercise.file){
            await cloudinary.uploader.destroy(exercise.file.public_id);
        }
        exercise.file={secure_url,public_id};
    }
    if(solutionType){
        if(await exerciseSolutionModel.findOne({courseId,exerciseId})){
            return next(new Error(`Cannot change the type of answer after user answer the exercise`));
        }
        exercise.solutionType=solutionType;
    }
    exercise.isUpdated=true;
    await exercise.save();
    return res.status(200).json({message:"Success",exercise});

});
export const deleteExercise =asyncHandller(async(req,res,next)=>{
    const {categoryId,subcategoryId,topicId,courseId,exerciseId}=req.params;
    const course =await courseModel.findOne({_id:courseId,isDelete:false,categoryId,subcategoryId,topicId});
    if(!course){
        return next(new Error(`Course not found`,{cause:404}));
    }
    let exercise = await exerciseModel.findOne({_id:exerciseId,courseId});
    if(JSON.stringify(course.createdBy)!=JSON.stringify(req.user._id)){
        return next(new Error(`only one who created exercise can delete it`));
    }
    exercise = await exerciseModel.deleteOne({_id:exerciseId,courseId});
    if(exercise.deletedCount==0){
        return next(new Error(`Exercise not found`,{cause:404}));
    }
    await exerciseSolutionModel.deleteMany({exerciseId,courseId})
    return res.status(200).json({message:"Success",exercise});
});
export const getExercise = asyncHandller(async(req,res,next)=>{
    const {courseId,categoryId,subcategoryId,topicId}=req.params;
    const course =await courseModel.findOne({_id:courseId,isDelete:false,categoryId,subcategoryId,topicId});
    if(!course){
        return next(new Error(`Course not found`,{cause:404}));
    }
    const exercises = await exerciseModel.find({courseId,categoryId,subcategoryId,topicId});
    if(exercises.length==0){
        return next(new Error(`No exercises found`,{cause:404}));
    }
    return res.status(200).json({message:"Success",exercises});
});
export const getSpecificExercise =asyncHandller(async(req,res,next)=>{
    const{courseId,exerciseId,categoryId,subcategoryId,topicId}=req.params;
    const course =await courseModel.findOne({_id:courseId,isDelete:false,categoryId,subcategoryId,topicId});
    if(!course){
        return next(new Error(`Course not found`,{cause:404}));
    }
    const exercise = await exerciseModel.findOne({_id:exerciseId,courseId});
    if(!exercise){
        return next(new Error(`No exercises found`,{cause:404}));
    }
        return res.status(200).json({message:"Success",exercise});
    });
