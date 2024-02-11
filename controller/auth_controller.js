import userDb from "../model/user-schema.js";
import passport from "passport";

// Google authentication
export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

// Google callback
export const googleCallback = (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("http://localhost:5173/login");
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("http://localhost:5173");
    });
  })(req, res, next);
};

// Login success
export const loginSuccess = async (req, res) => {
  try {
    // console.log(req.user);
    if (req.user) {
      res
        .status(200)
        .json({ message: "User logged in successfully", user: req.user });
    } else {
      res.status(400).json({ message: "Not Authorized" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = async (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("http://localhost:5173");
  });
};
