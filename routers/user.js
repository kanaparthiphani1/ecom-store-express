const express = require("express");
const router = express.Router();
const {
  signup,
  signin,
  signout,
  userDashboard,
  forgotPassword,
  resetPassword,
  changePassword,
  updateUserDetails,
  adminUpdateOneUserDetails,
  admingetOneUser,
  adminAllUser,
  managerAllUser,
} = require("../controllers/userController");
const validateCookie = require("../middlewares/user");
const { customRole } = require("../middlewares/customRole");

router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/signout").get(signout);
router.route("/forgotpassword").post(forgotPassword);
router.route("/reset/password/:token").post(resetPassword);
router.route("/user/dashboard").get(validateCookie, userDashboard);
router.route("/password/update").post(validateCookie, changePassword);
router.route("/user/dashboard/update").post(validateCookie, updateUserDetails);

router
  .route("/admin/users")
  .get(validateCookie, customRole("admin"), adminAllUser);

router
  .route("/admin/user/:id")
  .get(isLoggedIn, customRole("admin"), admingetOneUser)
  .put(isLoggedIn, customRole("admin"), adminUpdateOneUserDetails)
  .delete(isLoggedIn, customRole("admin"), adminDeleteOneUser);

router
  .route("/manager/users")
  .get(isLoggedIn, customRole("manager"), managerAllUser);

module.exports = router;
