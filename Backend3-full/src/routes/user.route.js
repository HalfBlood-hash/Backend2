

import {Router} from "express"
import {registerUser} from "../controllers/user.controllers.js"
import {upload} from "../middleware/multer.middleware.js"
const router =Router()

router.route('/register').post(
    upload.fields([
        {
            name:"avatar",// this name should be same in  fornend also
            maxCount:1
        },

        {
            name:"coverImage", // this name should be same in  forntend also
            maxCount:1
        }
    ]),
    registerUser
)

export default router;