import userDb from "../model/user-schema.js";
import passport from "passport";

// Google authentication
export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

// Google callback
export const googleCallback = passport.authenticate("google", {
  successRedirect: "http://localhost:5173",
  failureRedirect: "http://localhost:5173/login",
});

// Login success
export const loginSuccess = async (req, res) => {
  try {
    console.log(req.user);
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

export const logout = async (req, res) => {
  try {
    req.logout((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        res.status(500).json({ message: "Failed to logout" });
      } else {
        // Redirect the user to the login page after logout
        res.status(200).json({ message: "Logout successful" });
        // or if you still want to redirect and provide a message:
        // res.redirect("http://localhost:5173/login?message=Logout%20successful");
      }
    });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Failed to logout" });
  }
};
