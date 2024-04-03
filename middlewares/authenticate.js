const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/customError");
const {
  Admin,
  Customer,
  Staff,
  LaundryOwner,
} = require("../models/userModels");
const jwt = require("jsonwebtoken");
exports.isAuthenticatedUser = asyncErrorHandler(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new CustomError("Login first to handle the resource", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  let type = req.params.type;
  let user = req.user;

  if (type === "admin") {
    user = await Admin.findById(decoded.id);
    req.user = user;
  }
  if (type === "customer") {
    user = await Customer.findById(decoded.id);
    req.user = user;
  }
  if (type === "staff") {
    user = await Staff.findById(decoded.id);
    req.user = user;
  }
  if (type === "laundryOwner") {
    user = await LaundryOwner.findById(decoded.id);
    req.user = user;
  }
  if (!req.user) {
    return next(new CustomError("user not found", 404));
  }
  next();
});
