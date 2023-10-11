import { connectDB } from "../../DB/connection.js";
import authRouter from './auth/auth.router.js';
import { globalErrorHandler } from "../services/errorHandling.js";
import categoryRouter from './category/category.router.js';
import couponRouter from './coupon/coupon.router.js';
import cartRouter from './cart/cart.router.js';
import orderRouter from './order/order.router.js';
import userRouter from './user/user.router.js';
export const initApp = (express,app)=>{
    connectDB();
    app.use('/',(req,res)=>{
        return res.json({message:"Hello...!"})
    });
    app.use(express.json());
    app.use('/auth',authRouter);
    app.use('/category',categoryRouter);
    app.use('/coupon',couponRouter);
    app.use('/cart',cartRouter);
    app.use('/order',orderRouter);
    app.use('/user',userRouter);
    app.use(globalErrorHandler);
    app.use('*',(req,res)=>{
        return res.status(404).json({message:"Page Not Found"});
    });
}