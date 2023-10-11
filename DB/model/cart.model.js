import mongoose, { Schema, Types, model } from "mongoose";
const cartSchema = new Schema ({
    userId:{
        type:Types.ObjectId,
        required:true,
        ref:'User'
    },
    courses:[{
        courseId:{
            type:Types.ObjectId,
            ref:'Course',
            required:true
        },
        courseName:{
            type:String,
            required:true
        },
        _id:false
    }]
},{timestamps:true});
const cartModel = mongoose.models.Cart || model('Cart',cartSchema);
export default cartModel;