import moment from "moment";
import couponModel from "../../../../DB/model/coupon.model.js";
import { asyncHandller } from "../../../services/errorHandling.js";
import cartModel from "../../../../DB/model/cart.model.js";
import courseModel from "../../../../DB/model/course.model.js";
import orderModel from "../../../../DB/model/order.model.js";
import createInvoice from "../../../services/pdf.js";
import { sendEmail } from "../../../services/sendEmail.js";
export const createOrder = asyncHandller(async(req,res,next)=>{
    const{courses,address,couponName,phone}=req.body;
    const cart = await cartModel.findOne({userId:req.user._id});
    if(!cart?.courses.length){
        return next(new Error(`empty cart`));
    }
    for(let course of courses){
        const checkCourse = await orderModel.findOne({"courses.courseId":course.courseId,userId:req.user._id});
        if(checkCourse){
            return next(new Error(`you have already bought this course`));
        }
    }
    if(couponName){
        const coupon =await couponModel.findOne({name:couponName});
        if(!coupon){
            return next(new Error(`coupon not found`,{cause:404}));
        }
        const now = moment();
        const date = moment(coupon.expireDate,'MM/DD/YYYY');
        const diff = now.diff(date,'days');
        if(diff >=0){
            return next(new Error(`Expired coupon`,{cause:400}));
        }
        if(coupon.usedBy.includes(req.user._id)){
            return next(new Error(`coupon used by you`));
        }
        req.body.coupon = coupon;
    }
    let subtotal = 0;
    const coursesIdList =[];
    for(let course of courses){
        const checkCourse = await courseModel.findOne({_id:course.courseId,isDelete:false});
        if(!checkCourse){
            return next(new Error(`Course not found `,{cause:404}));
        }
        const courseOnCart = await cartModel.findOne({userId:req.user._id,"courses.courseId":course.courseId});
        if(!courseOnCart){
            return next(new Error(`Course not found on your cart`,{cause:404}));
        }
        course.courseName = checkCourse.name;
        course.price=checkCourse.price;
        subtotal+=course.price;
        coursesIdList.push(course.courseId);
    }
    const order = await orderModel.create({
        courses,
        address,
        couponId:req.body.coupon?._id,
        phone,
        subtotal,
        userId:req.user._id,
        totalPrice:subtotal-(subtotal*((req.body.coupon?.amount || 0))/100)
    });
    await cartModel.findOneAndUpdate({userId:req.user._id},{$pull:{courses:{courseId:{$in:coursesIdList}}}},{new:true});
        if(req.body.coupon){
            await couponModel.updateOne({_id:req.body.coupon._id},{$addToSet:{usedBy:req.user._id}});
        }
        const invoice = {
            shipping: {
                name:req.user.userName.toUpperCase(),
            },
            courses:order.courses,
            subtotal: order.subtotal,
            paid: order.totalPrice,
            invoice_nr:order._id
            };
            createInvoice(invoice, "invoice.pdf");
            sendEmail(req.user.email,'invoice attachment',`<h2>Invoice attachment</h2>`,{
                path:`invoice.pdf`,
                contentType:'application/pdf'
            });
        return res.status(201).json({message:"Success",order});
});
export const addAllFromCart = asyncHandller(async(req,res,next)=>{
    const{address,couponName,phone}=req.body;
    const cart = await cartModel.findOne({userId:req.user._id});
    if(!cart?.courses.length){
        return next(new Error(`empty cart`))
    }
    let courses = cart.courses.toObject();
    for(let course of courses){
        const checkCourse = await orderModel.findOne({"courses.courseId":course.courseId,userId:req.user._id});
        if(checkCourse){
            return next(new Error(`you have already bought this course`));
        }
    }
    if(couponName){
        const coupon = await couponModel.findOne({name:couponName});
        if(!coupon){
            return next(new Error(`Coupon not found`,{cause:404}));
        }
        const now = moment();
        const date = moment(coupon.expireDate,'MM/DD/YYYY');
        const diff = now.diff(date);
        if(diff >= 0){
            return next(new Error(`Expired coupon`,{cause:404}));
        }
        if(coupon.usedBy.includes(req.user._id)){
            return next(new Error(`coupon used by you`))
        }
        req.body.coupon = coupon;
    }
    let subtotal =0;
    let courseIdList =[];
    for(let course of courses){
        const checkCourse = await courseModel.findOne({_id:course.courseId,isDelete:false});
        if(!checkCourse){
            return next(new Error(`Course not found`,{cause:404}));
        }
        course.price = checkCourse.price;
        courseIdList.push(course.courseId);
        subtotal+=checkCourse.price;
    }
    const order = await orderModel.create({
        address,
        couponId:req.body.coupon?._id,
        phone,
        courses,
        subtotal,
        userId:req.user._id,
        totalPrice:subtotal-(subtotal*((req.body.coupon?.amount||0)/100))
    });
    cart.courses=[];
    await cart.save();
    if(req.body.coupon){
        await couponModel.updateOne({_id:req.body.coupon._id},{$addToSet:{usedBy:req.user._id}});
    }
    const invoice = {
        shipping: {
            name:req.user.userName.toUpperCase(),
        },
        courses:order.courses,
        subtotal: order.subtotal,
        paid: order.totalPrice,
        invoice_nr:order._id
        };
        createInvoice(invoice, "invoice.pdf");
        sendEmail(req.user.email,'invoice attachment',`<h2>Invoice attachment</h2>`,{
            path:`invoice.pdf`,
            contentType:'application/pdf'
        });
    return res.status(201).json({message:"Success",order});
});
export const orderNow =asyncHandller(async(req,res,next)=>{
    const{courseId,address,couponName,phone}=req.body;
    if(couponName){
        const coupon = await couponModel.findOne({name:couponName});
        if(!coupon){
            return next(new Error(`coupon not found`,{cause:404}));
        }
        let now = moment();
        let date =moment(coupon.expireDate,'MM/DD/YYYY');
        let diff = now.diff(date,'days');
        if(diff>=0){
            return next(new Error(`Coupin expired`));
        }
        if(coupon.usedBy.includes(req.user._id)){
            return next(new Error(`Coupon used by you`));
        }
        req.body.coupon=coupon;
    }
    const course = await courseModel.findOne({_id:courseId,isDelete:false});
    if(!course){
        return next(new Error(`course not found`,{cause:404}));
    }
        if(await orderModel.findOne({"courses.courseId":courseId,userId:req.user._id})){
            return next(new Error(`you have already bought this course`));
        }
    const order = await orderModel.create({
        address,
        couponId:req.body.coupon?._id,
        phone,
        userId:req.user._id,
        subtotal:course.price,
        totalPrice:course.price-(course.price*((req.body.coupon?.amount||0)/100)),
        courses:[{courseId:course._id,courseName:course.name,price:course.price}]
    });
    if(req.body.coupon){
        await couponModel.findByIdAndUpdate(req.body.coupon._id,{$addToSet:{usedBy:req.user._id}});
    }
    const invoice = {
        shipping: {
            name:req.user.userName.toUpperCase(),
        },
        courses:order.courses,
        subtotal: order.subtotal,
        paid: order.totalPrice,
        invoice_nr:order._id
        };
        createInvoice(invoice, "invoice.pdf");
        sendEmail(req.user.email,'invoice attachment',`<h2>Invoice attachment</h2>`,{
            path:`invoice.pdf`,
            contentType:'application/pdf'
        });
        return res.status(201).json({message:"Success",order});
});