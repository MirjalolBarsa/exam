import { Router } from "express";
import { SalesmanController } from "../controllers/salesman.controller.js";

const router = Router();
const controller = new SalesmanController();

router.post("/", controller.createSalesman);
router.get("/", controller.getAllSalesmen);
router.get("/:id", controller.getSalesmanById);
router.patch("/:id", controller.updateSalesman);
router.delete("/:id", controller.deleteSalesman);

export default router;
