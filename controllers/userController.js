const { bigPromise } = require("../middlewares/BigPromise");
const User = require("../models/User");
const { genJwtToken } = require("../utils/jwtTokenGen");

exports.signup = bigPromise(async (req, res) => {
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

exports.signin = bigPromise(async (req, res) => {
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

exports.signout = bigPromise(async (req, res) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .status(200)
    .json({ status: "success" });
});

exports.userDashboard = bigPromise(async (req, res) => {
  const { user } = req;
  if (!user) {
    return next(new Error("No Access"));
  }

  res.status(200).send({ user });
});
