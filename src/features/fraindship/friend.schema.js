import mongoose from "mongoose";
const fraindSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    friendId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    status:{
        type:String,
        enum:['pending','accepted','blocked'],
        default:'pending',
    }
});
export default fraindSchema;