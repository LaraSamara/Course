import userModel from "../../../../DB/model/user.model.js";
import { asyncHandller } from "../../../services/errorHandling.js";
import { generateToken } from "../../../services/generateAndVerifyToken.js";
import { compare, hash } from "../../../services/hashAndCompare.js";
import { sendEmail } from "../../../services/sendEmail.js";
export const updateAdminStatue =asyncHandller(async(req,res,next)=>{
    const{userId,status}=req.body;
    const user = await userModel.findById(userId);
    if(!user||user.role!='Admin'){
        return next(new Error(`User not found`,{cause:404}));
    }
    if(user.status==status){
        return next(new Error(`Old match new`,{cause:400}));
    }
    user.status=status;
    await user.save();
    return res.status(200).json({message:"Success",user});
});
export const changeRole = asyncHandller(async(req,res,next)=>{
    const{userId,role}=req.body;
    const user = await userModel.findById(userId);
    if(!user){
        return next(new Error(`User not found`,{cause:404}));
    }
    if(user.role==role){
        return next(new Error(`Old match New`));
    }
    if((user.role=='Admin'&& role=='User')||(user.role=='User'&& role=='Admin')){
        user.role=role;
        await user.save();
        return res.status(200).json({message:"Success",user});
    }else{
        return next(new Error(`Invalid operation`,{cause:400}));
    }
})
export const BlockUser = asyncHandller(async(req,res,next)=>{
    const{userId}=req.body;
    const user = await userModel.findOne({_id:userId,role:'User'});
    if(!user){
        return next(new Error(`user not found`,{cause:404}));
    }
    if(user.status!='Active'){
        return next(new Error(`Blocked user`))
    }
    user.status ='Not_Active';
    await user.save();
    return res.status(200).json({message:"Success",user});
});
export const unBlockUser = asyncHandller(async(req,res,next)=>{
    const{userId}=req.body;
    const user = await userModel.findOne({_id:userId,role:'User'});
    if(!user){
        return next(new Error(`user not found`,{cause:404}));
    }
    if(user.status!='Not_Active'){
        return next(new Error(`Active user`))
    }
    user.status ='Active';
    await user.save();
    return res.status(200).json({message:"Success",user});
});
export const updateInformation = asyncHandller(async(req,res,next)=>{
    const{email,userName,password,newPassword,confirmNewPassword}=req.body;
    let user = await userModel.findById(req.user._id);
    let match = compare(password,user.password);
    if(!match){
        return next(new Error(`Invalid password`));
        }
    if(email){
        if(user.email==email){
            return next(new Error(`Old email match new `,{cause:400}));
        }
        if(await userModel.findOne({email})){
            return next (new Error(`Duplicate email`,{cause:409}));
        }
        user.email=email;
        user.confirmEmail=false;
        const token= generateToken({email},process.env.EMAIL_SIGNITURE);
        const rToken =generateToken({email},process.env.EMAIL_SIGNITURE,24*60*60);
        const link =`${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`;
        const rLink=`${req.protocol}://${req.headers.host}/auth/newConfirmEmail/${rToken}`;
        const HTML =`<a href="${link}">PlEASE CONFIRM YOUR EMAIL</a><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><a href="${rLink}">SEND NEW EMAIL</a>`;
        sendEmail(email,'Confirm Your Email',HTML);
        
    }
    if(userName){
        user.userName=userName;
    }
    if(newPassword){
        if(!confirmNewPassword){
            return next(new Error(`confirm password is required`));
        }
        match = compare(newPassword,user.password);
        if(match){
            return next(new Error(`new password match old one`));
        }
        user.Password = hash(newPassword);
    }
    await user.save();
    return res.status(200).json({message:"Susccess",user});
});