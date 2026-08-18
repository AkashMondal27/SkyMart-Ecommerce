import  User  from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'

export const isAuth= asyncHandler(async(req,res,next)=>{

    try {
         const token = req.headers.token;
    
         if(!token){
            throw new ApiError(401 , "Unauthorized request")
         }
    
         const decodedToken= await jwt.verify(token, process.env.JWT_SECRET)
    
         const user=  await  User.findById(decodedToken?._id)
    
         if(!user){
            throw new ApiError( 401 ,"Invalid  Token")
         }
    
         req.user=user
         next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token")
        
    }
})

