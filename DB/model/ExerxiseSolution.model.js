import mongoose, { Schema, Types, model } from "mongoose";
const exerciseSolutionSchema = new Schema({
    courseId:{
        type:Types.ObjectId,
        required:true,
        ref:'Course'
    },
    exerciseId:{
        type:Types.ObjectId,
        required:true,
        ref:'Exercise'
    },
    userId:{
        type:Types.ObjectId,
        required:true,
        ref:'User'
    },
    text:{
        type:String,
    },
    file:{
        type:Object
    },
    mark:{
        type:Number,
    },
    note:{
        type:String
    }
},{timestamps:true});
const exerciseSolutionModel = mongoose.models.ExerciseSolution || model('ExerciseSolution',exerciseSolutionSchema);
export default exerciseSolutionModel;