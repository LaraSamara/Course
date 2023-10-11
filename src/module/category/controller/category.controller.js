import exerciseSolutionModel from "../../../../DB/model/ExerxiseSolution.model.js";
import categoryModel from "../../../../DB/model/category.model.js";
import courseModel from "../../../../DB/model/course.model.js";
import exerciseModel from "../../../../DB/model/exercise.model.js";
import reviewModel from "../../../../DB/model/review.model.js";
import subcategoryModel from "../../../../DB/model/subcategory.model.js";
import topicModel from "../../../../DB/model/topic.model.js";
import { asyncHandller } from "../../../services/errorHandling.js";
import slugify from "slugify";
export const createCategory =asyncHandller(async(req,res,next)=>{
    const name=req.body.name.toLowerCase();
    if(await categoryModel.findOne({name})){
        return next (new Error(`Duplicate Category Name`,{cause:409}));
    }
    const category = await categoryModel.create({name,slug:slugify(name),createdBy:req.user._id,updatedBy:req.user._id});
    return res.status(201).json({message:"Success",category});
});
export const updateCategory = asyncHandller(async(req,res,next)=>{
    const name=req.body.name.toLowerCase();
    const {categoryId}=req.params;
    const category = await categoryModel.findById(categoryId);
    if(!category){
        return next(new Error(`Invalid Category Id`,{cause:400}));
    }
    if(category.name == name){
        return next(new Error(`Old Name Match New Name`,{cause:400}));
    }
    if(await categoryModel.findOne({name})){
        return next(new Error('Duplicate Category Name',{cause:409}));
    }
    category.name =name;
    category.slug = slugify(name);
    category.updatedBy = req.user._id;
    await category.save();
    return res.status(200).json({message:"success",category});
});
export const getCategory = asyncHandller(async(req,res,next)=>{
    const categories = await categoryModel.find({});
    if(categories.length == 0){
        return next(new Error(`No categories have been created  yet`));
    }
    return res.status(200).json({message:"Success",categories});
});
export const getSpaceficCategory = asyncHandller(async(req,res,next)=>{
    const {categoryId}=req.params;
    const category = await categoryModel.findById(categoryId);
    if(!category){
        return next(new Error(`Category Not Found`,{cause:404}));
    }
    return res.status(200).json({message:"Success",category});
});
export const deleteCategory = asyncHandller(async(req,res,next)=>{
    const {categoryId}=req.params;
    const category = await categoryModel.deleteOne({_id:categoryId});
    if(!category){
        return next(new Error(`Invalid Category Id`,{cause:400}));
    }
    await subcategoryModel.deleteMany({categoryId});
    await topicModel.deleteMany({categoryId});
    let course = await courseModel.find({categoryId}).select('_id');
    await courseModel.deleteMany({categoryId});
    await reviewModel.deleteMany({courseId:{$in:course}});
    await exerciseModel.deleteMany({courseId:{$in:course}});
    await exerciseSolutionModel.deleteMany({courseId:{$in:course}});
    return res.status(200).json({message:"Success"});    
});