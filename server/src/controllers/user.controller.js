import { asyncHandler } from "../utils/asyncHandler.js";


export const loginUser=asyncHandler(async(req, res)=>{
     const{email}=req.body;
     
     res.json(email);


});