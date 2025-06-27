import { Router } from "express";
import { ClentController } from "../controllers/client.controller.js";
import { AuthGuard } from "../guards/auth.guard.js";
import { RolesGuard } from "../guards/roles.guard.js";
import { SelfGuard } from "../guards/self.guard.js";

const controller = new ClentController();
const router = Router();

router
  .post("/", controller.creatClent)
  .post("/signin", controller.signinClent)
  .post("/logout", AuthGuard, SelfGuard, controller.logoutClent)
  .get("/", AuthGuard, RolesGuard(["superadmin"]), controller.getAllClents)
  .get("/:id", AuthGuard, SelfGuard, controller.getClentById)
  .patch("/:id", AuthGuard, SelfGuard, controller.updateClent)
  .delete(
    "/:id",
    AuthGuard,
    RolesGuard(["superadmin"]),
    controller.deleteClent
  );

export default router;
