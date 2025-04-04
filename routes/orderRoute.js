express = require("express");
const router = express.Router();
const { createOrder } = require("../controllers/orderController");
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middlewares/authenticate");

router.route("/order/new").post(isAuthenticatedUser, createOrder);

module.exports = router;
