
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../model/user.modal.js"
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import {ApiResponse} from '../utils/ApiRespone.js'
import jwt from "jsonwebtoken"

const generateAccessTokenAndRefreshToken=async(userId)=>{
    try {
        
        const user =await User.findById(userId);
        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()
        user.refreshToken=refreshToken
        await user.save()
        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500," something went wrong in token generation")
    }
}

const registerUser= asyncHandler(async(req,res)=>{
        // res.status(200).json({
        //     message:"ok register"
        // })

        // get the data from front end
        //  check validation on the feild -not empty
        // check the if user already register or not 
        //    check the avart image and cover image
        // validate the avatar image n cover image in cloudiary 
        // create user object - save in db
        // remove password n refresh token from res 
        // check for the user creation 
        // send the respone

        const {username,fullname,email,password}=req.body
        if([username,fullname,email,password].some((feild)=>feild?.trim()===""))
        {
            throw new ApiError(400," All Feilds are required ");

        }
        const existedUser=await User.findOne({
            $or:[{ username },{ email }]
        })
        if(existedUser)
        {
            throw new ApiError(409," username or email already existed")
        }
           
            const avatarLocalPath=req.files?.avatar?.[0]?.path;
            // const CoverImageLocalPath=req.files?.coverImage?.[0]?.path;
            // sometime the way give us error when you not sending cover image
            let CoverImageLocalPath
            if(req.files && Array.isArray(req.files.coverImage)&& req.files.coverImage.length>0 )
                {
                    CoverImageLocalPath=req.files.coverImage[0].path;   
                }   

        if(!avatarLocalPath) throw new ApiError(400," Avatar is required ");
        const avatar= await uploadOnCloudinary(avatarLocalPath);
        const coverImage= await uploadOnCloudinary(CoverImageLocalPath);

    if(! avatar) throw new ApiError(400," Avatari is required "); 
    const user=await User.create({
    fullName:fullname,
    password,
    email,
    username:username.toLowerCase(),
    avatar:avatar.url,
    coverImage:coverImage?.url||""
    })   
    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken -watchHistory"
    )
    if(!createdUser) throw new ApiError( 500, "something went wrong during registering of user");
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered sucessfully")
    )
})

const loginUser= asyncHandler(async(req,res)=>{
    
    // get data from req body
     const {username,password}=req.body

    // check for the empty fields
    if([username,password].some((feild)=>feild?.trim()==="")) {
         throw new ApiError(400," All Feilds are required "); 
     }
     if(!username) {
         throw new ApiError(400," Username is required ");
     }
     // check for the user in db 
     const user=await User.findOne({username:username.toLowerCase()})
    if(!user) throw new ApiError(404," user not found with this username")
    // check for the password
    const isPasswordCorrect=await user.isPasswordCorrect(password)
    if(!isPasswordCorrect) throw new ApiError(401," Password is incorrect")
    // generate the access token n refresh token
    
    const {accessToken,refreshToken}=await generateAccessTokenAndRefreshToken(user._id);

    const loggedInUser=await User.findById(user._id).select(
        "-password -refreshToken -watchHistory" 
    )
    const options = {
        httpOnly: true,
        secure: true, // Set to true in production for HTTPS
        }

    return res
    .status(200)
    .cookie("refreshToken",refreshToken,options)
    .cookie("accessToken",accessToken,options)
    .json(
        new ApiResponse(200,
            { User:loggedInUser,accessToken,refreshToken},"User logged in sucessfully")
    )


    })
const logoutUser =asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {refreshToken:""},
        {new:true,}

    )
    const options = {
        httpOnly: true, 
        secure: true, // Set to true in production for HTTPS
    }
    return res
    .status(200)
    .clearCookie("refreshToken",options)
    .clearCookie("accessToken",options)
    .json(
        new ApiResponse(200,{},"User logged out sucessfully")
    )       
})

const refreshAccessToken=asyncHandler(async(req,res)=>{
    // get the refresh token from cookie or req body
    const incomingrefreshToken=req.cookies?.refreshToken||req.body?.refreshToken;
    // if the token is not present in req body then we throw error (user may be not logged in )
    if(!incomingrefreshToken) throw new ApiError(401," Refresh token is missing");
    // decode the token using jwt verify method because token is save in encoded form
    const decoded =jwt.verify(incomingrefreshToken,process.env.REFRESH_TOKEN_SECRET);
    console.log("decoed token"+decoded )
    // if decoded token is null or does not have _id then we throw error
    if(!decoded || !decoded._id) throw new ApiError(401," Invalid refresh token");
    // get the user from db based on decoded _id
    const user =await User.findById(decoded._id);
    // check if the user is present and also check if the incoming refresh token is same as the one in db
    if(!user || user.refreshToken !== incomingrefreshToken) throw new ApiError(401," Invalid refresh token");

    const options = {
        httpOnly: true, 
        secure: true, // Set to true in production for HTTPS    
        }

        const {accessToken,refreshToken}=await generateAccessTokenAndRefreshToken(user._id);
        return res 
        .status(200)
        .cookie("refreshToken",refreshToken,options)
        .cookie("accessToken",accessToken,options)
        .json(
            new ApiResponse(200,
                {accessToken,refreshToken},"Access token refreshed sucessfully")
        )
})
export {registerUser,loginUser,logoutUser,refreshAccessToken}