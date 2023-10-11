import mongoose, { Schema, Types, model } from "mongoose";
const couponSchema = new Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    amount:{
        type:Number,
        default:1,
    },
    usedBy:[{
        type:Types.ObjectId,
        ref:'User',
    }],
    createdBy:{
        type:Types.ObjectId,
        ref:'User',
        required:true
    },
    updatedBy:{
        type:Types.ObjectId,
        ref:'User',
        required:true
    },
    expireDate:{
        type:String,
        required:true
    }
},{timestamps:true});
const couponModel = mongoose.models.Coupon || model('Coupon',couponSchema);
export default couponModel;