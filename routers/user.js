const express = require("express");
const router = express.Router();
const {
  signup,
  signin,
  signout,
  userDashboard,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");
const validateCookie = require("../middlewares/user");

router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/signout").get(signout);
router.route("/forgotpassword").post(forgotPassword);
router.route("/reset/password/:token").post(resetPassword);
router.route("/user/dashboard").get(validateCookie, userDashboard);

module.exports = router;
