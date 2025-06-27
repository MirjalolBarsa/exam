import { Router } from "express";
import { SalesmanController } from "../controllers/salesman.controller.js";
import { AuthGuard } from "../guards/auth.guard.js";
import { RolesGuard } from "../guards/roles.guard.js";
import { SelfGuard } from "../guards/self.guard.js";

const router = Router();
const controller = new SalesmanController();

router
  .post("/", controller.creatSalesman)
  .post("/signin", controller.signinSalesman)
  .post(
    "/logout",
    AuthGuard,
    RolesGuard(["superadmin"]),
    controller.logoutSalesman
  )
  .get("/", AuthGuard, RolesGuard(["superadmin"]), controller.getAllSalesmans)
  .get("/:id", AuthGuard, SelfGuard, controller.getSalesmanById)
  .patch("/:id", AuthGuard, SelfGuard, controller.updateSalesman)
  .delete("/:id", AuthGuard, SelfGuard, controller.deleteSalesman);

export default router;
