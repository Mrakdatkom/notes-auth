import { Router } from "express";
import { register, login, getMe, logout } from "../controllers/authController.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.get("/me", authMiddleware, getMe);
router.post("/logout", logout);

export default router;