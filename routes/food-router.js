import express from "express";
import Stripe from "stripe";
import { Payment } from "../model/payment-schema.js";

const stripe = new Stripe(process.env.stripe_secret);

import {
  getAllFoods,
  createFood,
  getFoodById,
  updateFoodById,
  deleteFoodById,
  getFoodByHolemark,
  getFoodByCategory,
} from "../controller/food_controller.js";

const router = express.Router();

const calculateTotalAmount = (products) => {
  return products.reduce((total, product) => {
    return total + parseFloat(product.price) * product.quantity;
  }, 0);
};

router.get("/", getAllFoods);
router.post("/create", createFood);
router.get("/find/:id", getFoodById);
router.put("/update/:id", updateFoodById);
router.delete("/delete/:id", deleteFoodById);

router.get("/getByHolemark", getFoodByHolemark);
router.get("/getByCategory", getFoodByCategory);

router.post("/checkout", async (req, res) => {
  try {
    const { products, address } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      throw new Error("No products provided");
    }

    // Extract customer information from the address object
    const { userId, country } = address;

    // Determine the currency and address location
    const currency = "INR";
    const isAddressOutsideIndia = country !== "IN";

    // If the currency is not INR and the address is in India, throw an error
    if (currency !== "INR" && !isAddressOutsideIndia) {
      throw new Error(
        "Non-INR transactions in India must have shipping/billing address outside India"
      );
    }

    // Ensure that the country is set to "IN" if the address is in India
    const normalizedAddress = {
      ...address,
      country: isAddressOutsideIndia ? country : "IN",
    };

    const lineItems = products.map((product) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: product.title,
          images: [product.foodImg[0]],
        },
        unit_amount: Math.round(parseFloat(product.price) * 100),
      },
      quantity: product.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:5173/",
      cancel_url: "http://localhost:5173/about",
      shipping_address_collection: {
        allowed_countries: isAddressOutsideIndia ? country : ["IN"],
      },
    });

    const payment = new Payment({
      amount: calculateTotalAmount(products),
      razorpay_payment_id: session.id,
      razorpay_signature: session.id,
      userId: userId,
    });

    await payment.save();
    res.json({ id: session.id });
  } catch (error) {
    console.error("Error during checkout:", error.message);
    res.status(400).json({ error: error.message });
  }
});

export default router;
