import { Router } from "express";
import { register, login, getMe, logout } from "../controllers/authController.js";
import rateLimiter from "../middleware/rateLimiter.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", rateLimiter, register);
router.post("/login", rateLimiter, login);
router.get("/me", authMiddleware, getMe);
router.post("/logout", logout);

export default router;