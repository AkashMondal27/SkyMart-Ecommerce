import express from "express";
import { isAuth } from "../middlwares/isAuth.middleware.js";
import { addToCart, fetchCart, removeFromCart, updateCart } from "../controllers/cart.controller.js";


const router= express.Router();

router.route("/add").post(isAuth,addToCart);
router.route("/remove/:id").get(isAuth,removeFromCart);
router.route("/update").post(isAuth, updateCart);
router.route("/all").get(isAuth,fetchCart);



export default router;

