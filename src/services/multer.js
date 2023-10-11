import multer from "multer";
export const fileValidation = {
    image:['image/jpeg','image/png','image/gif'],
    file:['application/pdf'],
    video:['video/mp4']
}
export function fileUpload(customeValidation= []){
    const storage = multer.diskStorage({});
    function fileFilter (req,file,cb){
        if(customeValidation.includes(file.mimetype)){
            cb(null,true);
        }else{
            cb('Invalid Format',false);
        }
    }
    const upload = multer({fileFilter,storage});
    return upload;
}