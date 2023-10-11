import mongoose, { Schema,Types,model } from "mongoose";
const categorySchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    slug:{
        type:String,
        requird:true
    },
    createdBy:{
        type:Types.ObjectId,
        required:true,
        ref:'User'
    },
    updatedBy:{
        type:Types.ObjectId,
        requird:true,
        ref:'User'
    }
},{timestamps:true,
toJSON:{virtuals:true},
toObject:{virtuals:true}
});
categorySchema.virtual('subcategory',{
    localField:'_id',
    foreignField:'categoryId',
    ref:'Subcategory'
});
const categoryModel = mongoose.models.Category || model('Category',categorySchema);
export default categoryModel;