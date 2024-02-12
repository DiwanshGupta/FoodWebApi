import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    town: {
      type: String,
    },
    State: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    payment: { type: [String] },
    isadmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashpswd = await bcrypt.hash(user.password, salt);
    user.password = hashpswd;
  } catch (error) {
    next(error);
  }
});

userSchema.methods.generateToken = async function () {
  try {
    return jwt.sign(
      {
        userId: this._id.toString(),
        email: this.email,
        isadmin: this.isadmin,
      },
      process.env.Jwtoken,
      {
        expiresIn: "30d",
      }
    );
  } catch (error) {
    console.log(error);
  }
};
userSchema.methods.Comparepswd = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = new mongoose.model("User", userSchema);
export default User;
