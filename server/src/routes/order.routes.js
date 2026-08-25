import express from "express";
import { isAuth } from "../middlwares/isAuth.middleware.js";
import { getAllOrders, getAllOrdersAdmin, getMyOder, newOrderCod, updateStatus } from "../controllers/order.controller.js";

const router= express.Router();

router.route("/new/cod").post(isAuth , newOrderCod);
router.route("/all").get(isAuth , getAllOrders);
router.route("/admin/all").get(isAuth , getAllOrdersAdmin);
router.route("/:id").get(isAuth , getMyOder);
router.route("/:id").post(isAuth , updateStatus);

export default router;