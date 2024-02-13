import express from "express";
import {getAllUsers,getUserById,updateUserById,deleteUserById} from "../controller/user_controller.js";
import { verifyUser,verifyAdmin } from "../utility/verifyToken.js";

const router = express.Router();

router.get("/",verifyUser,verifyAdmin,getAllUsers);
router.get("/find/:id",verifyUser,getUserById);
router.put("/update/:id", verifyUser,updateUserById);
router.delete("/delete/:id",verifyUser,deleteUserById);

export default router;
