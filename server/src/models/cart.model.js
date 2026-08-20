import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({

quauntity:{
    type : Number,
    required: true
},
product:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Product",
    rrequired: true

}

},{timestamps:true})

export const Cart=mongoose.model("Cart" , cartSchema)