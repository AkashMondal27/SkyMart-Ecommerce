import express from "express";
import { isAuth } from "../middlwares/isAuth.middleware.js";
import { getAllOrders, getAllOrdersAdmin, getMyOder, newOrderCod } from "../controllers/order.controller.js";

const router= express.Router();

router.route("/new/cod").post(isAuth , newOrderCod);
router.route("/all").get(isAuth , getAllOrders);
router.route("/admin/all").get(isAuth , getAllOrdersAdmin);
router.route("/:id").get(isAuth , getMyOder);

export default router;