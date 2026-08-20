import express from "express"
import { isAuth } from "../middlwares/isAuth.middleware.js";
import { addAddress, deleteAddress, getAllAddress, getSingleAddress } from "../controllers/address.controller.js";

const router = express.Router();
router.route("/new").post(isAuth, addAddress);
router.route("/all").get(isAuth, getAllAddress);
router.route("/:id").get(isAuth, getSingleAddress);
router.route("/:id").delete(isAuth, deleteAddress);


export default router ;