import { asyncHandler } from "../utils/asyncHandler.js";

import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../model/user.modal.js";




export const verifyJwt=asyncHandler(async(req,__,next)=>{
    try {
        // get the token from the cookie or header
        const token =req.cookies?.accessToken||req.header("Authorization")?.replace("Bearer ","");
        // check if the token is present
        if(!token) throw new ApiError(401," Unauthorized : Access token is missing");
        // verify the token from 
        const decoded=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        // get the user from the db
        const user=await User.findById(decoded._id).select("-password -refreshToken -watchHistory")
        // check if the user is present
        if(!user) throw new ApiError(401," Unauthorized : user not found with this token");
        // attach the user to the req object
        req.user=user
        next()
    } catch (error) {
        throw new ApiError(401," Unauthorized : Invalid token");
    }
})