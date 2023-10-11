import mongoose, { Schema, Types, model } from "mongoose";
const subcategorySchema = new Schema({
    name:{
        type:String,
        required:true,
        uniqe:true,
        trim:true
    },
    slug:{
        type:String,
        required:true
    },
    categoryId:{
        type:Types.ObjectId,
        ref:'Category',
        required:true
    },
    createdBy:{
        type:Types.ObjectId,
        ref:'User',
        required:true
    },
    updatedBy:{
        type:Types.ObjectId,
        ref:'User',
        required:true
    }},
    {timestamps:true,
    toObject:{virtuals:true},
    toJSON:{virtuals:true}});
    subcategorySchema.virtual('topic',{
        localField:'_id',
        foreignField:'subcategoryId',
        ref:'Topic'
    });
const subcategoryModel = mongoose.models.Subcategory || model('Subcategory',subcategorySchema);
export default subcategoryModel;