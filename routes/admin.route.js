import { Router } from "express";
import { AdminController } from "../controllers/admin.controller.js";

const router = Router();
const controller = new AdminController();

router.post("/", controller.createAdmin);
router.get("/", controller.getAllAdmin);
router.get("/:id", controller.getAdminById);
router.patch("/:id", controller.updateAdmin);

export default router;
