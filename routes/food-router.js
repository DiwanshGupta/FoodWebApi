import express from "express";
import Stripe from 'stripe';
const stripe = new Stripe(process.env.stripe_secret);
import {getAllFoods,createFood,getFoodById,updateFoodById,deleteFoodById,getFoodByHolemark,getFoodByCategory} from "../controller/food_controller.js";

const router = express.Router();

router.get("/", getAllFoods);
router.post("/create", createFood);
router.get("/find/:id", getFoodById);
router.put("/update/:id", updateFoodById);
router.delete("/delete/:id", deleteFoodById);

router.get("/getByHolemark", getFoodByHolemark);
router.get("/getByCategory", getFoodByCategory);

router.post("/create-checkout-session",async(req,res)=>{
    const { products } = req.body;
    const lineItems = products.map((product)=>({
        price_data:{
            currency:"inr",
            product_data:{
                name:product.title,
            },
            unit_amount:product.price*100,
        },
        quantity:product.quantity
    }));
    
    const session = await stripe.checkout.sessions.create({
        payment_method_types:["card"],
        line_items:lineItems,
        mode:"payment",
        success_url:"http://localhost:3000/",
        cancel_url:"http://localhost:3000/",
    });
    res.json({id:session.id})
})

export default router;
