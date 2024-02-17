import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} from "../controller/user_controller.js";
import authMiddleware from "../middleware/authmiddleware.js";
import adminMiddleware from "../middleware/admin-middlleware.js";

const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, getAllUsers);
router.get("/find/:id", authMiddleware, adminMiddleware, getUserById);
router.put("/update/:id", authMiddleware, adminMiddleware, updateUserById);
router.delete("/delete/:id", authMiddleware, adminMiddleware, deleteUserById);

// router.get("/", authMiddleware, getAllUsers);
// router.get("/find/:id", authMiddleware, getUserById);
// router.put("/update/:id", authMiddleware,updateUserById);
// router.delete("/delete/:id", authMiddleware, deleteUserById);

export default router;
