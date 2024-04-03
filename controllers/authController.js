const CustomError = require("./../utils/customError");
const asyncErrorHandler = require("./../utils/asyncErrorHandler");
const {
  Customer,
  Admin,
  LaundryOwner,
  Staff,
} = require("../models/userModels");
const Laundry = require("../models/laundryModel");
const errorHandler = require("../middlewares/errorHandler");
const sendToken = require("../utils/jwt");
const sendEmail = require("../utils/email");
const crypto = require("crypto");
const { log } = require("console");

//register Customer -/api/v1/customer/register
exports.registerCustomer = asyncErrorHandler(async (req, res, next) => {
  console.log("registeruser");
  // try {
  const { name, email, password, address, contactNo } = req.body;

  const user = await Customer.create({
    name,
    email,
    password,
    address,
    contactNo,
  });
  const token = user.getJwtToken();
  res.status(201).json({
    success: true,
    user,
    token,
  });
  // } catch (error) {
  //   console.log(error);
  // }
});

//register Admin -/api/v1/admin/register
exports.registerAdmin = asyncErrorHandler(async (req, res, next) => {
  const { name, email, password, address, contactNo } = req.body;

  const user = await Admin.create({
    name,
    email,
    password,
    address,
    contactNo,
  });
  const token = user.getJwtToken();

  res.status(201).json({
    success: true,
    user,
    token,
  });
});

//register LaundryOwner -/api/v1/laundryOwner/register
exports.registerLaundryOwner = asyncErrorHandler(async (req, res, next) => {
  const {
    name,
    email,
    password,
    address,
    contactNo,
    laundryName,
    regNo,
    area,
    services,
  } = req.body;

  const user = await LaundryOwner.create({
    name,
    email,
    password,
    address,
    contactNo,
  });

  const laundry = await Laundry.create({
    laundryName,
    regNo,
    area,
    services,
  });
  const token = user.getJwtToken();

  res.status(201).json({
    success: true,
    user,
    token,
    laundry,
  });
});

//register staff -/api/v1/staff/register
exports.registerStaff = asyncErrorHandler(async (req, res, next) => {
  const { name, email, password, address, contactNo, sNic, laundry } = req.body;

  const user = await Staff.create({
    name,
    email,
    password,
    address,
    contactNo,
    sNic,
    laundry,
  });
  // const token = user.getJwtToken();
  // res.status(201).json({
  //   success: true,
  //   user,
  //   token,
  // });
  sendToken(user, 201, res);
});

//login all - /api/v1/login
exports.logIn = asyncErrorHandler(async (req, res, next) => {
  const { email, password, type } = req.body;
  let user;
  if (!email || !password) {
    return next(new CustomError("Please enter email and password", 400)); //400- not providing
  }
  if (type === "admin") {
    user = await Admin.findOne({ email }).select("+password");
  }
  if (type === "customer") {
    user = await Customer.findOne({ email }).select("+password");
  }
  if (type === "staff") {
    user = await Staff.findOne({ email }).select("+password");
  }
  if (type === "laundryOwner") {
    user = await LaundryOwner.findOne({ email }).select("+password");
  }

  if (!user) {
    return next(new CustomError("invalid email or password", 401));
  }

  if (!(await user.isValidPassword(password))) {
    return next(new CustomError("invalid email or password", 401));
  }
  // const token = user.getJwtToken();
  // res.status(201).json({
  //   success: true,
  //   user: user,
  //   message: `${user.name}, logged in successfully`,
  //   token,
  // });
  sendToken(user, 201, res);
});

//logout - /api/v1/logout
exports.logout = asyncErrorHandler(async (req, res, next) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .status(200)
    .json({
      success: true,
      message: "loggedout",
    });
});

//Forgot Password - /api/v1/password/forgot
exports.forgotPassword = asyncErrorHandler(async (req, res, next) => {
  const { email, type } = req.body;
  let user;

  if (type === "admin") {
    user = await Admin.findOne({ email });
  }
  if (type === "customer") {
    user = await Customer.findOne({ email });
  }
  if (type === "staff") {
    user = await Staff.findOne({ email });
  }
  if (type === "laundryOwner") {
    user = await LaundryOwner.findOne({ email });
  }
  if (!user) {
    return next(new CustomError("user not found with given email", 404));
  }
  const resetToken = user.getResetToken();
  await user.save({ validateBeforeSave: false });

  //create reset url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${type}/${resetToken}`;

  const message = `Your password reset url is as follows \n\n ${resetUrl} \n\n if you have not requested the email, then ignore it`;

  try {
    sendEmail({
      email: user.email,
      subject: "laundry hub password recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new CustomError(error.message), 500);
  }
});

//Reset Passsword -/api/v1/password/:user/:token
exports.resetPassword = asyncErrorHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  console.log("Token" + req.params.token);

  console.log("resetPasswordToken" + resetPasswordToken);
  let user;
  let type = req.params.type;

  if (type === "admin") {
    user = await Admin.findOne({
      resetPasswordToken,
      resetPasswordTokenExpire: {
        $gt: Date.now(),
      },
    });
  }
  if (type === "customer") {
    user = await Customer.findOne({
      resetPasswordToken,
      resetPasswordTokenExpire: {
        $gt: Date.now(),
      },
    });
  }
  if (type === "staff") {
    user = await Staff.findOne({
      resetPasswordToken,
      resetPasswordTokenExpire: {
        $gt: Date.now(),
      },
    });
  }
  if (type === "laundryOwner") {
    user = await LaundryOwner.findOne({
      resetPasswordToken,
      resetPasswordTokenExpire: {
        $gt: Date.now(),
      },
    });
  }
  // const user = await Customer.findOne({
  // resetPasswordToken,
  // resetPasswordTokenExpire:{
  //   $gt: Date.now(),
  // }
  // })

  if (!user) {
    return next(new CustomError("password reset token is inavalid or expired"));
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new CustomError("password doesn't match"));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpire = undefined;
  await user.save({ validateBeforeSave: false });

  sendToken(user, 201, res);
});

//Get User Profile - /api/v1/myprofile
exports.getUserProfile = asyncErrorHandler(async (req, res, next) => {
  const type = req.params.type;
  if (type === "admin") {
    user = await Admin.findById(req.user.id);
  }
  if (type === "customer") {
    user = await Customer.findById(req.user.id);
  }
  if (type === "staff") {
    user = await Staff.findById(req.user.id);
  }
  if (type === "laundryOwner") {
    user = await LaundryOwner.findById(req.user.id);
  }
  if (!user) {
    return next(new CustomError("user not found", 404));
  }
  res.status(200).json({
    success: true,
    user,
  });
});

//change password - /api/v1/password/change/:type
exports.changePassword = asyncErrorHandler(async (req, res, next) => {
  let user;
  let type = req.params.type;

  if (type === "admin") {
    user = await Admin.findById(req.user.id).select("+password");
  }
  if (type === "customer") {
    user = await Admin.findById(req.user.id).select("+password");
  }
  if (type === "staff") {
    user = await Admin.findById(req.user.id).select("+password");
  }
  if (type === "laundryOwner") {
    user = await Admin.findById(req.user.id).select("+password");
  }

  //chack old password
  if (!(await user.isValidPassword(req.body.oldPassword))) {
    return next(new CustomError("Old password is incorrect", 401));
  }

  //assigning new password
  user.password = req.body.password;
  await user.save();
  res.status(200).json({
    success: true,
  });
});
