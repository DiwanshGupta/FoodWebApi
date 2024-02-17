import express from "express";
import { login, register, user } from "../controller/auth_controller.js";
import authMiddleware from "../middleware/authmiddleware.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/user", authMiddleware, user);

export default router;
