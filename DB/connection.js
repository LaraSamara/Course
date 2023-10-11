import mongoose from "mongoose";
export const connectDB = ()=>{
    return mongoose.connect(process.env.LOCA_DB)
}