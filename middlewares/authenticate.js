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
  const role = decoded.role;
  const userId = decoded.id;

  if (role === "admin") {
    user = await Admin.findById(userId);
    req.user = user;
  }
  if (role === "customer") {
    req.user = await Customer.findById(userId);
  }
  if (role === "staff") {
    user = await Staff.findById(userId);
    req.user = user;
  }
  if (role === "laundryOwner") {
    user = await LaundryOwner.findById(userId);
    req.user = user;
  }
  // console.log(req.params.type);
  // console.log(req.user);
  // let type = req.params.type;
  // let user = req.user;
  // console.log(type);
  // console.log(user);
  // if (type === "admin") {
  //   user = await Admin.findById(decoded.id);
  //   req.user = user;
  // }
  // if (type === "customer") {
  //   user = await Customer.findById(decoded.id);
  //   req.user = user;
  // }
  // if (type === "staff") {
  //   user = await Staff.findById(decoded.id);
  //   req.user = user;
  // }
  // if (type === "laundryOwner") {
  //   user = await LaundryOwner.findById(decoded.id);
  //   req.user = user;
  // }
  if (!req.user) {
    return next(new CustomError("user not found", 404));
  }
  next();
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new CustomError(`Role ${req.user.role} is not allowed`, 401));
    }
    next();
  };
};
