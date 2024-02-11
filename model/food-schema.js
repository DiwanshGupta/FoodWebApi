import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: String, required: true },
    rating: { type: String, required: true },
    holemark: { type: Boolean, default: false },
    town: { type: String },
    foodImg: {
      type: [String],
      default: [
        "https://s1.1zoom.me/b5050/466/Hamburger_French_fries_Vegetables_Black_background_540048_3840x2400.jpg",
        "https://th.bing.com/th/id/OIP.exHSDmjH3d6p7xu6xlK9egHaE8?w=1920&h=1280&rs=1&pid=ImgDetMain",
        "https://th.bing.com/th/id/OIP.W9RFknwcGfgpMFJFhQurjgAAAA?rs=1&pid=ImgDetMain",
      ],
    },
  },
  { timestamps: true }
);
export default mongoose.model("Food", foodSchema);

// export default foodDb;
