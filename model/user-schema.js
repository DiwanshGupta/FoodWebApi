import mongoose from "mongoose";

const userschema = new mongoose.Schema(
  {
    googleId: {
      type: String,
    },
    username: {
      type: String,
    },
    email: {
      type: String,
    },
    image: {
      type: String,
    },
    town: {
      type: String,
    },
    phone: {
      type: String,
    },
    isadmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const userDb = new mongoose.model("users", userschema);

export default userDb;
