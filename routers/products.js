const express = require("express");
const { customRole } = require("../middlewares/customRole");
const validateCookie = require("../middlewares/user");
const {
  addProduct,
  getAllProduct,
  getOneProduct,
  adminUpdateOneProduct,
  adminDeleteOneProduct,
} = require("../controllers/productController");
const router = express.Router();

router.route("/products").get(getAllProduct);
router.route("/product/:id").get(getOneProduct);

router
  .route("/admin/product/add")
  .post(validateCookie, customRole("admin"), addProduct);

router
  .route("/admin/product/:id")
  .put(validateCookie, customRole("admin"), adminUpdateOneProduct)
  .delete(validateCookie, customRole("admin"), adminDeleteOneProduct);
