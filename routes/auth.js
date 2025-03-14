express = require("express");
const router = express.Router();
const {
  registerCustomer,
  registerAdmin,
  registerLaundryOwner,
  registerStaff,
  logIn,
  logout,
  forgotPassword,
  resetPassword,
  getUserProfile,
  changePassword,
} = require("../controllers/authController");
const { isAuthenticatedUser } = require("../middlewares/authenticate");

router.route("/customer/register").post(registerCustomer);
router.route("/admin/register").post(registerAdmin);
router.route("/laundryOwner/register").post(registerLaundryOwner);
router.route("/staff/register").post(registerStaff);
router.route("/login").get(logIn);
router.route("/logout").get(logout);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:type/:token").post(resetPassword);
router.route("/myprofile/").get(isAuthenticatedUser, getUserProfile);
router.route("/logout").get(logout);
router.route("/password/change/").put(isAuthenticatedUser, changePassword);
module.exports = router;
