import express from "express";

import {
  createProduct,
  getMyProducts,
  getAllProducts,
  deleteProduct,
} from "../controllers/productController.js";

import { protect } from "../middleware/authMiddleware.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getAllProducts);

router.get(
  "/my-products",
  protect,
  getMyProducts
);

router.post(
  "/create",
  protect,
  upload.single("image"),
  createProduct
);

router.delete(
  "/:id",
  protect,
  deleteProduct
);

export default router;