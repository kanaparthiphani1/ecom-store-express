const express = require("express");
const { customRole } = require("../middlewares/customRole");
const validateCookie = require("../middlewares/user");
const {
  addProduct,
  getAllProduct,
  getOneProduct,
  adminUpdateOneProduct,
  adminDeleteOneProduct,
  addReview,
  deleteReview,
  getOnlyReviewsForOneProduct,
} = require("../controllers/productController");
const router = express.Router();

router.route("/products").get(getAllProduct);
router.route("/product/:id").get(getOneProduct);
router.route("/review").put(validateCookie, addReview);
router.route("/review").delete(validateCookie, deleteReview);
router.route("/reviews").get(validateCookie, getOnlyReviewsForOneProduct);

router
  .route("/admin/product/add")
  .post(validateCookie, customRole("admin"), addProduct);

router
  .route("/admin/product/:id")
  .put(validateCookie, customRole("admin"), adminUpdateOneProduct)
  .delete(validateCookie, customRole("admin"), adminDeleteOneProduct);

module.exports = router;
