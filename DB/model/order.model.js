import mongoose, { Schema, Types, model } from "mongoose";
const orderSchema = new Schema({
    userId:{
        type:Types.ObjectId,
        ref:'User',
        required:true
    },
    courses:[{
        courseId:{type:Types.ObjectId,ref:'Course',required:true},
        courseName:{type:String,required:true},
        price:{type:Number,required:true}
    }],
    subtotal:{
        type:Number,
        required:true
    },
    totalPrice:{
        type:Number,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    couponId:{
        type:Types.ObjectId,
        ref:'Coupon',
    }
},{timestamps:true});
const orderModel = mongoose.models.Order || model('Order',orderSchema);
export default orderModel;