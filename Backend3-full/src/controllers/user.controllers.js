
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../model/user.modal.js"
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import {ApiResponse} from '../utils/ApiRespone.js'



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
        const existedUser=User.findOne({
            $or:[{ username },{ email }]
        })
        if(existedUser)
        {
            throw new ApiError(409," username or email already existed")
        }

        const avatarLocalPath=req.file?.avatar[0]?.path;
        const CoverImageLocalPath=req.file?.coverImage[0]?.path;

        if(!avatarLocalPath) throw new ApiError(400," Avatar is required ");

        const avatar= await uploadOnCloudinary(avatarLocalPath);
        const coverImage= await uploadOnCloudinary(CoverImageLocalPath);

    if(! avatar) throw new ApiError(400," Avatar is required "); 
    const user=await User.create({
        fullName,
        password,
        email,
        username:username.toLowercase(),
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

export {registerUser}