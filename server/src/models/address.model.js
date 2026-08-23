import mongoose from "mongoose";


const addressSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
     
    },
    address:{
        type:String,
        required :true,

    },
    phone:{
       type :Number,
       required:true 
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{
        timestamps: true
    })

export const Address = mongoose.model("Address", addressSchema)