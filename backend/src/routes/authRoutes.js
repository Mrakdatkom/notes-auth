import { Router } from "express";
import { register, login, getMe } from "../controllers/authController.js";
import rateLimiter from "../middleware/rateLimiter.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", rateLimiter, register); // you already have this!
router.post("/login", rateLimiter, login);
router.get("/me", authMiddleware, getMe);

export default router;