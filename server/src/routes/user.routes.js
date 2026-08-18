import { Router } from "express";
import { loginUser,verifyUser  } from "../controllers/user.controller.js";

const router= Router();

router.route("/login").post(loginUser)
router.route("/verify").post(verifyUser )

export default router;