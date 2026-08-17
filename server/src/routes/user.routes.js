import { Router } from "express";
import { loginUser,verifyOtp  } from "../controllers/user.controller.js";

const router= Router();

router.route("/login").post(loginUser)
router.route("/verify").post(verifyOtp )

export default router;