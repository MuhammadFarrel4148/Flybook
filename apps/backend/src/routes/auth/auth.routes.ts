import { Router } from "express";
import { authController } from "../../controllers/auth/auth.controller.ts";

const router = Router();

router.post("/register", authController.register);
router.post("/register/sso", authController.registerSso);
router.post("/login", authController.login);

export default router;
