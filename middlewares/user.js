const jwt = require("jsonwebtoken");
const { bigPromise } = require("./BigPromise");
const User = require("../models/User");

const validateCookie = bigPromise(async (req, res, next) => {
  const cookie = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!cookie) {
    return next(new Error("No Token"));
  }

  const decoded = jwt.verify(cookie, process.env.JWTSECRET);

  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new Error("No User"));
  }

  req.user = user;

  next();
});

module.exports = validateCookie;
