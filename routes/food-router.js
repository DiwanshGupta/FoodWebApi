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
    const currency = "USD";
    const isAddressOutsideUSA = country !== "US";

    // If the currency is not USD and the address is in the USA, throw an error
    if (currency !== "USD" && !isAddressOutsideUSA) {
      throw new Error(
        "Non-USD transactions in the USA must have shipping/billing address outside the USA"
      );
    }

    const normalizedAddress = {
      ...address,
      country: isAddressOutsideUSA ? country : "US",
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
      success_url: "https://foodyhut.vercel.app/success",
      cancel_url: "https://foodyhut.vercel.app/cancel",
      shipping_address_collection: {
        allowed_countries: isAddressOutsideUSA ? ["US"] : [], // Adjusted here
      },
    });

    // Store the payment status in the schema
    const payment = new Payment({
      amount: calculateTotalAmount(products),
      razorpay_payment_id: session.id,
      razorpay_signature: session.id,
      userid: userId,
      status: "success", // Default to success, change it if payment fails
    });

    await payment.save();
    res.json({ id: session.id });
  } catch (error) {
    console.error("Error during checkout:", error.message);
    // Store the payment status as error in the schema
    const payment = new Payment({
      amount: calculateTotalAmount(products), // products should be defined here
      userid: userId,
      status: "error",
    });
    await payment.save();
    res.status(400).json({ error: error.message });
  }
});

export default router;
