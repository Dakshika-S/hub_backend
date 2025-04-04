express = require("express");
const router = express.Router();
const {
  logIn,
  logout,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { isAuthenticatedUser } = require("../middlewares/authenticate");

router.route("/login").get(logIn);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:type/:token").post(resetPassword);
router.route("/logout").get(logout);

module.exports = router;
