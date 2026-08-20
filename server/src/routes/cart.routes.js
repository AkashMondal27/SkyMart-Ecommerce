import express from "express";
import { isAuth } from "../middlwares/isAuth.middleware.js";
import { addToCart } from "../controllers/cart.controller.js";


const router= express.Router();

router.route("/add").post(isAuth,addToCart);


export default router;

