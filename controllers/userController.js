const { bigPromise } = require("../middlewares/BigPromise");
const User = require("../models/User");
const { genJwtToken } = require("../utils/jwtTokenGen");
const sendMail = require("../utils/mailHelper");
const crypto = require("crypto");

exports.signup = bigPromise(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new Error("Name, Email, Password are required"));
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  user.password = undefined;
  genJwtToken(user, res);
});

exports.signin = bigPromise(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new Error("email and password is required"));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(400).send({ status: "Not Registered" });
  }

  if (!(await user.isValidPassword(password))) {
    return res.status(400).send({ status: "Email or Password is incorret" });
  }

  genJwtToken(user, res);
});

exports.forgotPassword = bigPromise(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new Error("Not Registered"));
  }
  const token = await user.genForgotPasswordToken();

  await user.save({ validateBeforeSave: false });

  const linkText = `${req.protocol}://${req.host}/api/v1/reset/password/${token}`;

  const options = {
    toAddr: email,
    subject: "Password reset for store app",
    text: linkText,
  };

  try {
    await sendMail(options);
  } catch (e) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save();
    // console.log(e);
    return next(new Error(e.message));
  }

  res.status(200).send({ status: "Email sent" });
});

exports.resetPassword = bigPromise(async (req, res, next) => {
  const token = req.params.token;
  const { password, confPassword } = req.body;
  if (!password || !confPassword) {
    return next(new Error("Password and Confirm Password are required"));
  }

  if (password !== confPassword) {
    return next(new Error("Password and Confirm Password must be equal"));
  }

  const hashToken = crypto.createHash("sha256").update(token).digest("hex");

  //e4aa7db8eeeac22a4fe50e911dc0e4bb185663a33b013d3727f8b64189abb2b3

  const user = await User.findOne({
    forgotPasswordToken: hashToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return next(new Error("User not registered"));
  }

  user.password = password;

  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;

  await user.save();

  genJwtToken(user, res);
});

exports.signout = bigPromise(async (req, res, next) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .status(200)
    .json({ status: "success" });
});

exports.userDashboard = bigPromise(async (req, res, next) => {
  const { user } = req;
  if (!user) {
    return next(new Error("No Access"));
  }

  res.status(200).send({ user });
});
