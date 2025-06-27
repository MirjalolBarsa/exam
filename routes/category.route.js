import { Router } from "express";
import { CategoryController } from "../controllers/category.controller.js";

const controller = new CategoryController();

const router = Router();
router
  .post("/", controller.creatCategory)
  .get("/", controller.getAllCategorys)
  .get("/:id", controller.getCategoryById)
  .patch("/:id", controller.updateCategory)
  .delete("/:id", controller.deleteCategory);

export default router;
