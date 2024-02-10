import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./utility/db.js";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-google-oauth2";
import authRoutes from "./routes/auth-router.js";
import foodRoutes from "./routes/food-router.js"
import userDb from "./model/user-schema.js";
dotenv.config();
const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: "GET,POST,DELETE,PUT",
        credentials: true,
    })
);
app.use(
    session({
        secret: process.env.SecretKey,
        resave: false,
        saveUninitialized: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

passport.use(
  new Strategy(
    {
      clientID: process.env.ClientId,
      clientSecret: process.env.ClientSecret,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await userDb.findOne({ googleId: profile.id });
        if (!user) {
          user = new userDb({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
            image: profile.photos[0].value,
          });
          await user.save();
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Routes
app.use("/auth", authRoutes);
app.use("/food", foodRoutes);

app.get("/", (req, res) => {
  res.status(200).send("Welcome to the MERN app");
});

const port = process.env.PORT || 500;
connectDb();
app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
