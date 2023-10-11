import userModel from "../../../../DB/model/user.model.js";
import { asyncHandller } from "../../../services/errorHandling.js";
import { generateToken, verifyToken } from "../../../services/generateAndVerifyToken.js";
import { compare, hash } from "../../../services/hashAndCompare.js";
import { sendEmail } from "../../../services/sendEmail.js";
import {customAlphabet} from 'nanoid';
export const signup =asyncHandller(async (req,res,next)=>{
    const {email,userName,password,confirmPassword}=req.body;
    if(await userModel.findOne({email})){
        return next(new Error(`Email is Already Exists`,{cause:409}));
    }
    const hashPassword = hash(password);
    const token= generateToken({email},process.env.EMAIL_SIGNITURE);
    const rToken =generateToken({email},process.env.EMAIL_SIGNITURE,24*60*60);
    const link =`${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`;
    const rLink=`${req.protocol}://${req.headers.host}/auth/newConfirmEmail/${rToken}`;
    const HTML =`<a href="${link}">PlEASE CONFIRM YOUR EMAIL</a><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><a href="${rLink}">SEND NEW EMAIL</a>`;
    sendEmail(email,'Confirm Your Email',HTML);
    const user = await userModel.create({email,userName,password:hashPassword});
    return res.status(201).json({message:"Success",user});
});
export const confirmEmail = asyncHandller(async(req,res,next)=>{
    const{email}=verifyToken(req.params.token,process.env.EMAIL_SIGNITURE);
    if(!email){
        return next(new Error(`Invalid Token`,{cause:400}));
    }
    const user = await userModel.updateOne({email},{confirmEmail:true});
    if(user.modifiedCount==0){
        return next(new Error(`Not Registered A ccount`,{cause:404}));
    }
    return res.status(200).json({message:"Email is Confirmed"});
});
export const newConfirmEmail =asyncHandller(async(req,res,next)=>{
    const {email}=verifyToken(req.params.token,process.env.EMAIL_SIGNITURE);
    if(!email){
        return next(new Error(`Invalid Token`,{causw:400}));
    }
    const user = await userModel.findOne({email});
    if(!user){
        return next(new Error(`Not Registered Account`,{cause:404}));
    }
    if(user.confirmEmail){
        return res.status(200).json({message:"Email is Already Confirmed"});
    }
    const token = generateToken({email},process.env.EMAIL_SIGNITURE);
    const link =`${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`;
    const HTML=`<a href ="${link}">CONFIRM YOUR EMAIL</a>`;
    sendEmail(email,'CONFIRM YOUR EMAIL',HTML);
    return res.status(200).json({message:"New Email is Send"});
});
export const signin = asyncHandller(async(req,res,next)=>{
    const{email,password}=req.body;
    const user= await userModel.findOne({email});
    if(!user){
        return next(new Error(`Invalid Data`,{cause:404}));
    }
    if(!user.confirmEmail){
        return next(new Error(`Please Confirm Your Email`));
    }
    if(user.status == 'Not_Active'){
        return next(new Error(`Blocked Account`));
    }
    const match = compare(password,user.password);
    if(!match){
        return next(new Error(`Invalid Data`))
    }
    const token = generateToken({id:user._id},process.env.LOGIN_SIGNITURE);
    const rToken=generateToken({id:user._id},process.env.LOGIN_SIGNITURE,24*60*60);
    return res.status(200).json({message:"Success",token,rToken});
});
export const sendCode =asyncHandller(async(req,res,next)=>{
    const{email}=req.body;
    let code = customAlphabet('123456789lArSN',5);
    code=code();
    const user= await userModel.updateOne({email},{forgetCode:code});
    if(user.modifiedCount==0){
        return next(new Error(`Not Registered Account`,{cause:404}));
    }
    sendEmail(email,'FORGET CODE',`<h2>YOUR CODE IS ${code}</h2>`);
    return res.status(200).json({message:'Code is Sent To Your Email'});
});
export const forgetPassword =asyncHandller(async(req,res,next)=>{
    const{email,password,confirmPassword,code}=req.body;
    const user=await userModel.findOne({email});
    if(!user){
        return next(new Error(`Not Regesired Account`,{cause:404}));
    }
    if(!user.confirmEmail){
        return next(new Error(`Please Confirm Your Email`));
    }
    if(!code||user.forgetCode!=code){
        return next(new Error(`The Code is Incorrect`));
    }
    if(compare(password,user.password)){
        return next(new Error(`Old Password Match New Password`));
    }
    user.password=hash(password);
    user.forgetCode=null;
    user.forgetPasswordTime=Date.now();
    await user.save();
    return res.status(200).json({message:"Success"});
});