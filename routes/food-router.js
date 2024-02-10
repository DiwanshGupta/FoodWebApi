import express from "express";
import {getAllFoods,createFood,getFoodById,updateFoodById,deleteFoodById,getFoodByHolemark,getFoodByCategory} from "../controller/food_controller.js";

const router = express.Router();

router.get("/", getAllFoods);
router.post("/create", createFood);
router.get("/find/:id", getFoodById);
router.put("/update/:id", updateFoodById);
router.delete("/delete/:id", deleteFoodById);

router.get("/getByHolemark", getFoodByHolemark);
router.get("/getByCategory", getFoodByCategory);

export default router;
