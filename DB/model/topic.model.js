import mongoose, { Schema, Types, model } from "mongoose";
const topicSchema = new Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    slug:{
        type:String,
        required:true
    },
    image:{
        type:Object,
        required:true
    },
    categoryId:{
        type:Types.ObjectId,
        ref:'Category',
        required:true
    },
    subcategoryId:{
        type:Types.ObjectId,
        required:true,
        ref:'Subcategory'
    },
    createdBy:{
        type:Types.ObjectId,
        ref:'User',
        required:true
    },
    updatedBy:{
        type:Types.ObjectId,
        required:true,
        ref:'User'
    }
},{timestamps:true});
const topicModel = mongoose.models.Topic || model('Topic',topicSchema);
export default topicModel;