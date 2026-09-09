import express from "express";
import { isAuth } from "../middlwares/isAuth.middleware.js";
import {
    getAllOrders,
    getAllOrdersAdmin,
    getMyOder,
    newOrderCod,
    newOrderOnlinePayment,
    updateStatus,
    verifyPayment,
    getOrderStatus,
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/new/cod", isAuth, newOrderCod);
router.post("/new/online", isAuth, newOrderOnlinePayment);

router.post("/verify/", isAuth, verifyPayment);

router.get("/all", isAuth, getAllOrders);
router.get("/admin/all", isAuth, getAllOrdersAdmin);
router.get("/:id", isAuth, getMyOder);

router.get("/:id/status", isAuth, getOrderStatus);

router.patch("/:id/status", isAuth, updateStatus);

export default router;