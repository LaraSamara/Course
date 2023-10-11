import mongoose, { Schema, Types, model } from "mongoose";
const userSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    confirmEmail:{
        type:Boolean,
        default:false
    },
    password:{
        type:String,
        required:true
    },
    userName:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['Super_Admin','Admin','User'],
        default:'User'
    },
    status:{
        type:String,
        enum:['Active','Not_Active'],
        default:'Active'
    },
    forgetPasswordTime:{
        type:Date,
    },
    forgetCode:{
        type:String,
        default:null
    }
},{timestamps:true});
const userModel = mongoose.models.User || model('User',userSchema);
export default userModel;