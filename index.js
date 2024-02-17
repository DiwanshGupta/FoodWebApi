import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./utility/db.js";
import authRoutes from "./routes/auth-router.js";
import foodRoutes from "./routes/food-router.js";
import userRoutes from "./routes/user-router.js";
dotenv.config();
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: ["https://foodyhut.vercel.app"],
    methods: "GET,POST,DELETE,PUT",
    credentials: true,
  })
);
// Routes
app.use("/auth", authRoutes);
app.use("/food", foodRoutes);
app.use("/user", userRoutes);

app.get("/", (req, res) => {
  res.status(200).send("Welcome to the MERN app");
});

const port = process.env.PORT || 500;
connectDb();
app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
