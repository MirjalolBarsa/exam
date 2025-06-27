import { Router } from "express";
import { AuthGuard } from "../guards/auth.guard.js";
import { RolesGuard } from "../guards/roles.guard.js";
import { SelfGuard } from "../guards/self.guard.js";
import { ProductController } from "../controllers/product.controller.js";

const router = Router();
const controller = new ProductController();

router
  .post(
    "/",
    AuthGuard,
    RolesGuard(["salesman", "superadmin"]),
    controller.createProduct
  )
  .get("/", AuthGuard, SelfGuard, controller.getAllProduct)
  .get("/:id", AuthGuard, SelfGuard, controller.getProductById)
  .patch("/:id", AuthGuard, SelfGuard, controller.updateProduct)
  .delete("/:id", AuthGuard, SelfGuard, controller.deleteProduct);

export default router;
