const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    validate: [validator.isEmail, "Please enter valid email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minLength: [6, "Password should be atleast 6 charcters"],
    select: false,
  },
  role: {
    type: String,
    default: "user",
  },
  photo: {
    id: {
      type: String,
      //   required: [true, "Id is required"],
    },
    secure_url: {
      type: String,
      //   required: [true, "secure url is required"],
    },
  },
  forgotPasswordToken: String,
  forgotPasswordExpiry: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isValidPassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

userSchema.methods.generateJWTtoken = function () {
  return jwt.sign({ id: this._id }, process.env.JWTSECRET, {
    expiresIn: process.env.JWTEXPIRES,
  });
};

userSchema.methods.genForgotPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
