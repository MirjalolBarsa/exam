import { Router } from "express";
import { CategoryController } from "../controllers/category.controller.js";

const router = Router();
const controller = new CategoryController();

router.post("/", controller.createCategory);
router.get("/", controller.getAllCategory);
router.get("/:id", controller.getCategoryById);
router.patch("/:id", controller.updateCategory);
router.delete("/:id", controller.deleteCategory);

export default router;
