import mongoose, { Schema, Types, model } from "mongoose";
const reviewSchema = new Schema({
    comment:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        required:true
    },
    courseId:{
        type:Types.ObjectId,
        ref:'Course',
        required:true
    },
    userId:{
        type:Types.ObjectId,
        required:true,
        ref:'User'
    },
    like:[{type:Types.ObjectId,ref:'User'}],
    unLike:[{type:Types.ObjectId,ref:'User'}],
    totalVote:{
        type:Number,
        default:0
    }
},{timestamps:true});
const reviewModel = mongoose.models.Review || model('Review',reviewSchema);
export default reviewModel;