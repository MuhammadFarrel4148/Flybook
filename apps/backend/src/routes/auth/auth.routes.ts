import { Router } from "express";
import { authController } from "../../controllers/auth/auth.controller.ts";

const router = Router();

router.post("/register", authController.register);

export default router;
