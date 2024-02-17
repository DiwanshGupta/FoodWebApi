import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  razorpay_payment_id: {
    type: String,
    required: true,
  },
  razorpay_signature: {
    type: String,
    required: true,
  },
  userid: {
    type: String,
    required: true,
  },
  status: {
    type: String,
  },
});

export const Payment = mongoose.model("Payment", paymentSchema);
