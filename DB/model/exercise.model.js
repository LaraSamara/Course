import mongoose, { Schema, Types, model } from "mongoose";
const exerciseSchema = new Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    text:{
        type:String,
        required:true
    },
    file:{
        type:Object
    },
    courseId:{
        type:Types.ObjectId,
        ref:'Course',
        required:true
    },
    createdBy:{
        type:Types.ObjectId,
        ref:'User',
        required:true
    },
    isUpdated:{
        type:Boolean,
        default:false
    },
    solutionType:{
        type:String,
        required:true,
        enum:['Text','File','Text&File']
    },
},{timestamps:true});
const exerciseModel = mongoose.models.Exercise || model('Exercise',exerciseSchema);
export default exerciseModel;