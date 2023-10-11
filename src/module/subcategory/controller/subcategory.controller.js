import slugify from "slugify";
import categoryModel from "../../../../DB/model/category.model.js";
import subcategoryModel from "../../../../DB/model/subcategory.model.js";
import { asyncHandller } from "../../../services/errorHandling.js";
import topicModel from "../../../../DB/model/topic.model.js";
import courseModel from "../../../../DB/model/course.model.js";
import reviewModel from "../../../../DB/model/review.model.js";
import exerciseModel from "../../../../DB/model/exercise.model.js";
import exerciseSolutionModel from "../../../../DB/model/ExerxiseSolution.model.js";
export const createSubCategory =asyncHandller(async(req,res,next)=>{
    const {categoryId}=req.params;
    let {name}=req.body;
    name = name.toLowerCase();
    if(!await categoryModel.findById(categoryId)){
        return next(new Error(`Category Not Found`,{cause:404}));
    }
    if(await subcategoryModel.findOne({name})){
        return next(new Error(`Duplicate subcategory name`,{cause:409}));
    }
    const subcategory = await subcategoryModel.create({name,slug:slugify(name),categoryId,createdBy:req.user._id,updatedBy:req.user._id});
    return res.status(201).json({message:"Success",subcategory});
});
export const updateSubcategory = asyncHandller(async(req,res,next)=>{
    const name=req.body.name.toLowerCase();
    const{categoryId,subcategoryId}=req.params;
    const subcategory =await subcategoryModel.findOne({_id:subcategoryId,categoryId});
    if(!subcategory){
        return next(new Error(`Subcategory not found`,{cause:404}));
    }
    if(subcategory.name == name){
        return next(new Error(`Old Name Match New Name `,{cause:400}));
    }
    if(await subcategoryModel.findOne({name})){
        return next(new Error(`Duplicate Subcategory Name`,{cause:409}));
    }
    subcategory.name=name;
    subcategory.slug=slugify(name);
    subcategory.updatedBy=req.user._id;
    await subcategory.save();
    return res.status(200).json({message:"Success",subcategory});
});
export const getSubcategories =asyncHandller(async(req,res,next)=>{
    const {categoryId} = req.params;
    const subcategories = await subcategoryModel.find({categoryId});
    if(subcategories.length==0){
        return next(new Error(`No subcategory for this category`));
    }
    return res.status(200).json({message:"Success",subcategories});
});
export const getSpeceficCategory = asyncHandller(async(req,res,next)=>{
    const{subcategoryId,categoryId}=req.params;
    const subcategory = await subcategoryModel.findOne({categoryId,_id:subcategoryId});
    if(!subcategory){
        return next(new Error(`Subcategory Not Found`,{cause:404}));
    }
    return res.status(200).json({message:'Success',subcategory});
});
export const deleteSubcategory = asyncHandller(async(req,res,next)=>{
    const{categoryId,subcategoryId}=req.params;
    let subcategory =await subcategoryModel.findOne({_id:subcategoryId,categoryId});
    if(!subcategory){
        return next(new Error(`Subcategory not found`,{cause:404}));
    }
    subcategory = await subcategoryModel.deleteOne({_id:subcategoryId,categoryId});
    await topicModel.deleteMany({subcategoryId,categoryId});
    let course = await courseModel.find({subcategoryId,categoryId}).select('_id');
    await courseModel.deleteMany({subcategoryId,categoryId});
    await reviewModel.deleteMany({courseId:{$in:course}});
    await exerciseModel.deleteMany({courseId:{$in:course}});
    await exerciseSolutionModel.deleteMany({courseId:{$in:course}});
    return res.status(200).json({message:"Success"}); 

});