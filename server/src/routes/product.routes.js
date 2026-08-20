import express from "express"
import { Router } from "express";
import { isAuth } from "../middlwares/isAuth.middleware.js";
import { createProduct } from "../controllers/product.controller.js";
import { uploadFiles } from "../middlwares/multer.middleware.js";
import { getAllProducts } from "../controllers/getAllProduct.controller.js";
import { getSingleProduct } from "../controllers/getSingleProduct.controller.js";
import { updateProduct } from "../controllers/updateProduct.controller.js";
import { updateProductImage } from "../controllers/updateImage.controller.js";

const router = express.Router();

router.route("/new").post(isAuth,uploadFiles,  createProduct);
router.route("/all").get(getAllProducts);
router.route("/:id").get(getSingleProduct);
router.route("/:id").put(isAuth, updateProduct);
router.route("/:id").post(isAuth, uploadFiles, updateProductImage);

export default router ;