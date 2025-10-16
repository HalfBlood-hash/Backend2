

import {Router} from "express"
import {registerUser,loginUser,logoutUser, refreshAccessToken} from "../controllers/user.controllers.js"
import {upload} from "../middleware/multer.middleware.js"
import { verifyJwt } from "../middleware/auth.middleware.js"    
const router =Router()

router.route('/register').post(
    upload.fields([
        {
            name:"avatar",// this name should be same in  forntend also
            maxCount:1
        },

        {
            name:"coverImage", // this name should be same in  forntend also
            maxCount:1
        }
    ]),
    registerUser
)

router.route('/login').post(loginUser)


// secured route
router.route('/logout').post(verifyJwt,logoutUser)
router.route('/refresh-token').post(refreshAccessToken)


export default router;