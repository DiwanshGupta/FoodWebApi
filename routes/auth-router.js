import express from "express";
import {
  googleCallback,
  googleAuth,
  loginSuccess,
  logout,
} from "../controller/auth_controller.js";

const router = express.Router();

router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);
router.get("/login/success", loginSuccess);
router.post("/logout/path", logout);

export default router;
