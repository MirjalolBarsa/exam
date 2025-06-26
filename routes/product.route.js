import { Router } from "express";
import { ProductController } from "../controllers/product.controller.js";

const router = Router();
const controller = new ProductController();

router.post("/", controller.createProduct);
router.get("/", controller.getAllProduct);
router.get("/:id", controller.getProductById);
router.patch("/:id", controller.updateProduct);
router.delete("/:id", controller.deleteProduct);

export default router;
