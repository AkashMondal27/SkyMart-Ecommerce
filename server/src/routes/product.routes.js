import express from "express";

import { isAuth } from "../middlwares/isAuth.middleware.js";
import { isAdmin } from "../middlwares/isAdmin.middleware.js";

import { createProduct } from "../controllers/product.controller.js";
import { uploadFiles } from "../middlwares/multer.middleware.js";
import { getAllProducts } from "../controllers/getAllProduct.controller.js";
import { getSingleProduct } from "../controllers/getSingleProduct.controller.js";
import { updateProduct } from "../controllers/updateProduct.controller.js";
import { updateProductImage } from "../controllers/updateImage.controller.js";

const router = express.Router();

// Admin only
router.route("/new").post(
  isAuth,
  isAdmin,
  uploadFiles,
  createProduct
);

// Public
router.route("/all").get(getAllProducts);
router.route("/:id").get(getSingleProduct);

// Admin only
router.route("/:id").put(
  isAuth,
  isAdmin,
  updateProduct
);

router.route("/:id").post(
  isAuth,
  isAdmin,
  uploadFiles,
  updateProductImage
);

export default router;





