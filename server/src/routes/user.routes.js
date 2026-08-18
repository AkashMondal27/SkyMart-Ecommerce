import { Router } from "express";
import { loginUser,verifyUser  } from "../controllers/user.controller.js";
import { isAuth } from "../middlwares/isAuth.middleware.js";
import { myProfile } from "../controllers/myProfile.controller.js";


const router= Router();

router.route("/login").post(loginUser)
router.route("/verify").post(verifyUser)
router.route("/me").get(isAuth,myProfile)    

export default router;