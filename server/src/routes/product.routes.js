import express from "express"
import { Router } from "express";
import { isAuth } from "../middlwares/isAuth.middleware.js";
import { createProduct } from "../controllers/product.controller.js";
import { uploadFiles } from "../middlwares/multer.middleware.js";

const router = express.Router();

router.route("/new").post(isAuth,uploadFiles,  createProduct)

export default router ;