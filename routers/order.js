const express = require("express");
const {
  createOrder,
  getOneOrder,
  getLoggedInOrders,
  admingetAllOrders,
  adminUpdateOrder,
  adminDeleteOrder,
} = require("../controllers/orderController");
const router = express.Router();
const validateCookie = require("../middlewares/user");
const { customRole } = require("../middlewares/customRole");

router.route("/order/create").post(validateCookie, createOrder);
router.route("/order/:id").get(validateCookie, getOneOrder);
router.route("/myorder").get(validateCookie, getLoggedInOrders);

router
  .route("/admin/orders")
  .get(validateCookie, customRole("admin"), admingetAllOrders);
router
  .route("/admin/order/:id")
  .put(validateCookie, customRole("admin"), adminUpdateOrder)
  .delete(validateCookie, customRole("admin"), adminDeleteOrder);

module.exports = router;
