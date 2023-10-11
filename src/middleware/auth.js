import userModel from "../../DB/model/user.model.js";
import { asyncHandller } from "../services/errorHandling.js";
import { verifyToken } from "../services/generateAndVerifyToken.js";
export const roles={
    admin:'Admin',
    user:'User',
    super:'Super_Admin'
}
export const auth = (accessRole =[])=>{
    return asyncHandller(async(req,res,next)=>{
        const{authorization} = req.headers;
        if(!authorization?.startsWith(process.env.BEARER_KEY)){
            return next(new Error(`Bearer Key is Required`,{cause:400}));
        }
        const token = authorization.split(process.env.BEARER_KEY)[1];
        if(!token){
            return next(new Error(`Token is Required`,{cause:400}));
        }
        const decoded = verifyToken(token,process.env.LOGIN_SIGNITURE);
        if(!decoded){
            return next(new Error(`Invalid Payload`,{cause:400}));
        }
        let user = await userModel.findById(decoded.id).select(`userName role email forgetPasswordTime`);
        if(!user){
            return next(new Error(`Not Registered Account`,{cause:404}));
        }
        if(!accessRole.includes(user.role)){
            return next(new Error(`Not Authorized User`,{cause:403}));
        }
        if(parseInt(user.forgetPasswordTime?.getTime()/1000)>decoded.iat){
            return next(new Error(`Expired Token`,{cause:400}));
        }
        req.user = user;
        return next();
    });
}