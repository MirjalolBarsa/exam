import { Router } from "express";
import { SolidProductController } from "../controllers/solidProduct.controller";

const controller = SolidProductController();
const router = Router();

router
  .post("/", controller.createSolid)
  .get("/", controller.getAllSolidProduct)
  .get("/:id", controller.getSolidProductById)
  .patch("/:id", controller.updateSolidProduct)
  .delete("/:id", controller.deleteSolidProduct);

export default router;
