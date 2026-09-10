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






// import express from "express"
// import { Router } from "express";
// import { isAuth } from "../middlwares/isAuth.middleware.js";
// import { createProduct } from "../controllers/product.controller.js";
// import { uploadFiles } from "../middlwares/multer.middleware.js";
// import { getAllProducts } from "../controllers/getAllProduct.controller.js";
// import { getSingleProduct } from "../controllers/getSingleProduct.controller.js";
// import { updateProduct } from "../controllers/updateProduct.controller.js";
// import { updateProductImage } from "../controllers/updateImage.controller.js";

// const router = express.Router();

// router.route("/new").post(isAuth,uploadFiles,  createProduct);
// router.route("/all").get(getAllProducts);
// router.route("/:id").get(getSingleProduct);
// router.route("/:id").put(isAuth, updateProduct);
// router.route("/:id").post(isAuth, uploadFiles, updateProductImage);

// export default router ;