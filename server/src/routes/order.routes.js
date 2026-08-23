import express from "express";
import { isAuth } from "../middlwares/isAuth.middleware.js";
import { newOrderCod } from "../controllers/order.controller.js";

const router= express.Router();

router.route("/new/cod").post(isAuth , newOrderCod);

export default router;