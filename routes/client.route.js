import { Router } from "express";
import { ClientController } from "../controllers/client.controller.js";

const router = Router();
const controller = new ClientController();

router.post("/signup", controller.signInClient);
router.post("/signin", controller.signInClient);
router.post("/logout", controller.logoutClient);

export default router;
