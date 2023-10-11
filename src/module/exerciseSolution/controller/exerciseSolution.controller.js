import exerciseSolutionModel from "../../../../DB/model/ExerxiseSolution.model.js";
import courseModel from "../../../../DB/model/course.model.js";
import exerciseModel from "../../../../DB/model/exercise.model.js";
import orderModel from "../../../../DB/model/order.model.js";
import { asyncHandller } from "../../../services/errorHandling.js";
export const createSolution = asyncHandller(async(req,res,next)=>{
    const{courseId,exerciseId,topicId,categoryId,subcategoryId}=req.params;
    const course = await courseModel.findOne({_id:courseId,isDelete:false,topicId,categoryId,subcategoryId});
    if(!course){
        return next(new Error(`Course not found`,{cause:404}));
    }
    let exercies = await exerciseModel.findByOne({_id:exerciseId,courseId});
    if(!exercies){
        return next(new Error(`exercise not found`,{cause:404}));
    }
    const user = await orderModel.findOne({userId:req.user._id,"courses.courseId":courseId});
    if(!user){
        return next(new Error(`Cannot solve before buy`));
    }
    if(await exerciseSolutionModel.findOne({userId:req.user._id,courseId,exerciseId})){
        return next(new Error(`you alreay make solution`));
    }
    const{text}=req.body;
    if(exercies.solutionType == 'Text'){
        if(!text){
            return next(new Error(`Text is required`,{cause:400}));
        }
        const solution = await exerciseSolutionModel.create({text,userId:req.user._id,courseId,exerciseId});
        return res.status(201).json({message:"Success",solution});
    }else if(exercies.solutionType == 'File'){
        if(!req.file){
            return next(new Error(`File is required`,{cause:400}));
        }
        const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/course/${courseId}/exercise/${exercies._id}`});
        const solution = await exerciseSolutionModel.create({file:{secure_url,public_id},userId:req.user._id,courseId,exerciseId});
        return res.status(201).json({message:"Success",solution});
    }else if(exercies.solutionType == 'Text&File'){
        if(req.file){
        const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/course/${courseId}/exercise/${exercies._id}`});
        req.body.file ={secure_url,public_id};
    }
    const solution = await exerciseSolutionModel.create({text,file:req.body,file,userId:req.user._id,courseId,exerciseId});
        return res.status(201).json({message:"Success",solution});
    }else{
        return next(new Error(`invalid operation`));
    }
});
export const updateSolution = asyncHandller(async(req,res,next)=>{
    const{courseId,exerciseId,solutionId,categoryId,subcategoryId,topicId}=req.params;
    const course = await courseModel.findOne({_id:courseId,isDelete:false,categoryId,subcategoryId,topicId});
    if(!course){
        return next(new Error(`Course not found`,{cause:404}));
    }
    let exercies = await exerciseModel.findOne({_id:exerciseId,courseId});
    if(!exercies){
        return next(new Error(`exercise not found`,{cause:404}));
    }
    let solution = await exerciseSolutionModel.findOne({_id:solutionId,userId:req.user._id,exerciseId,courseId});
    if(!solution){
        return next(new Error(`Solution not found`));
    }
    if(exercies.solutionType == 'Text'){
        solution.text=req.body.text;
    }else if(exercies.solutionType == 'File'){
        if(req.file){
            const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/course/${courseId}/exercise/${exercies._id}`});
            solution.file = {secure_url,public_id};
        }
    }else if(exercies.solutionType == 'Text&File'){
        if(req.file){
        const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/course/${courseId}/exercise/${exercies._id}`});
        solution.file={secure_url,public_id};
    }
    solution.text =req.body.text;
    }else{
        return next(new Error(`invalid operation`));
    }
    await solution.save();
    return res.status(200).json({message:"success"});
});
export const deleteSolution = asyncHandller(async(req,res,next)=>{
    const{courseId,exerciseId,solutionId,categoryId,subcategoryId,topicId}=req.params;
    const course = await courseModel.findOne({_id:courseId,isDeleted:false,categoryId,subcategoryId,topicId});
    if(!course){
        return next(new Error(`Course not found`,{cause:404}));
    }
    let exercies = await exerciseModel.findByOne({_id:exerciseId,courseId});
    if(!exercies){
        return next(new Error(`exercise not found`,{cause:404}));
    }
    let solution = await exerciseSolutionModel.deleteOne({_id:solutionId,userId:req.user._id,courseId,exerciseId});
    if(solution.deletedCount==0){
        return next(new Error(`Solution not found`));
    }
    return res.status(200).json({message:'Success'});
});
export const getSolutions = asyncHandller(async(req,res,next)=>{
    const{courseId,exerciseId,categoryId,subcategoryId,topicId}=req.params;
    const course = await courseModel.findOne({_id:courseId,isDelete:false,categoryId,subcategoryId,topicId});
    if(!course){
        return next(new Error(`Course not found`,{cause:404}));
    }
    let exercies = await exerciseModel.findOne({_id:exerciseId,courseId});
    if(!exercies){
        return next(new Error(`exercise not found`,{cause:404}));
    }
    if( JSON.stringify(exercies.createdBy) != JSON.stringify(req.user._id)){
        return next(new Error(`not authorized operation`));
    }
    const solutions = await exerciseSolutionModel.find({exerciseId,courseId});
    if(solutions.length==0){
        return next(new Error(`no solutions yet`));
    }
    return res.status(200).json({message:"Success",solutions});
});
export const getSpecificSolution = asyncHandller(async(req,res,next)=>{
    const{courseId,exerciseId,solutionId,categoryId,subcategoryId,topicId}=req.params;
    const course = await courseModel.findOne({_id:courseId,isDelete:false,categoryId,subcategoryId,topicId});
    if(!course){
        return next(new Error(`Course not found`,{cause:404}));
    }
    let exercies = await exerciseModel.findOne({_id:exerciseId,courseId});
    if(!exercies){
        return next(new Error(`exercise not found`,{cause:404}));
    }
    const solution = await exerciseSolutionModel.findOne({_id:solutionId,exerciseId,courseId});
    if(!solution){
        return next(new Error(`Solution Not found`,{cause:404}));
    }
    if(JSON.stringify(solution.userId)!=JSON.stringify(req.user._id) && JSON.stringify(exercies.createdBy)!= JSON.stringify(req.user._id)){
        return next(new Error(`not authorized operation`));
    }
    return res.status(200).json({message:"Success",solution});
});
export const markSolution = asyncHandller(async(req,res,next)=>{
    const{courseId,exerciseId,solutionId,topicId,categoryId,subcategoryId}=req.params;
    const course = await courseModel.findOne({_id:courseId,isDelete:false,topicId,categoryId,subcategoryId});
    if(!course){
        return next(new Error(`Course not found`,{cause:404}));
    }
    let exercies = await exerciseModel.findOne({_id:exerciseId,courseId});
    if(!exercies){
        return next(new Error(`exercise not found`,{cause:404}));
    }
    if(JSON.stringify(exercies.createdBy)!=JSON.stringify(req.user._id)){
        return next(new Error(`not authorized operation`));
    }
    let solution = await exerciseSolutionModel.findOne({_id:solutionId,courseId,exerciseId});
    if(!solution){
        return next(new Error(`Solution not found`));
    }
    if(solution.mark){
        return next(new Error(`you alredy marked the exercise`));
    }
    const{mark,note}=req.body;
    solution.mark=mark;
    solution.note=note;
    await solution.save();
    return res.status(200).json({message:"Success",solution});
});
export const updateMark = asyncHandller(async(req,res,next)=>{
    const{courseId,exerciseId,solutionId,categoryId,subcategoryId,topicId}=req.params;
    const course = await courseModel.findOne({_id:courseId,isDelete:false,categoryId,subcategoryId,topicId});
    if(!course){
        return next(new Error(`Course not found`,{cause:404}));
    }
    let exercies = await exerciseModel.findOne({_id:exerciseId,courseId});
    if(!exercies){
        return next(new Error(`exercise not found`,{cause:404}));
    }
    if(JSON.stringify(exercies.createdBy)!= JSON.stringify(req.user._id)){
        return next(new Error(`not authorized operation`));
    }
    let solution = await exerciseSolutionModel.findOne({_id:solutionId,courseId,exerciseId});
    if(!solution){
        return next(new Error(`Solution not found`));
    }
    if(!solution.mark){
        return next(new Error(`Cannot update before marke the solution`));
    }
    const{mark,note}=req.body;
    solution.mark=mark;
    solution.note=note;
    await solution.save();
    return res.status(200).json({message:"Success",solution});
});
