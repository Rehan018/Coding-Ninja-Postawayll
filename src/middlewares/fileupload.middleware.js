import multer from "multer";
const fileFilter=(req,file,callback)=>{
    if(file.mimetype.startWith("image/")){
        callback(null,true);
    }else{
        callback(new Error('Error: Only image files are allowed!'),false);
    }
}
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads/");
  },
  filename: (req, file, callback) => {
    callback(null, new Date().toISOString() + file.originalname);
  },
});
export const upload = multer({ 
    storage: storage
 });
