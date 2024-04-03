const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, "Please enter your name"],
//   },
//   email: {
//     type: String,
//     required: [true, "Please enter your email"],
//     unique: true,
//     validate: [validator.isEmail, "Pleae enter a valid email"],
//   },
//   password: {
//     type: String,
//     required: [true, "Please enter the password"],
//     maxlength: [6, "pasword cannot exceed 6 characters"],
//     select: false, //wont retrive in all conditon except .select('+password');
//   },
//   avatar: {
//     type: String,
//   },
//   role: {
//     type: String,
//     default: "user",
//   },
// });

// //module.exports.user = mongoose.model('user', userSchema)
// let model = mongoose.model("user", userSchema);
// module.exports = model;

const baseUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validate: [validator.isEmail, "Pleae enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter the password"],
    minlength: [6, "password cannot exceed 6 characters"],
    select: false, //wont retrive in all conditon except .select('+password');
  },
  avatar: {
    type: String,
  },
  address: {
    type: String,
    required: [true, "Please enter the address"],
  },
  contactNo: {
    type: String,
    required: [true, "Please enter the contact No"],
  },
  resetPasswordToken: String,
  resetPasswordTokenExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const customerSchema = new mongoose.Schema({
  ...baseUserSchema.obj,
});
const adminSchema = new mongoose.Schema({
  ...baseUserSchema.obj,
});

const laundryOwnerSchema = new mongoose.Schema({
  ...baseUserSchema.obj,

  contact_person_name: {
    type: String,
  },
});

const staffSchema = new mongoose.Schema({
  ...baseUserSchema.obj,
  sNic: {
    type: String,
    required: [true, "Please enter the NIC Number"],
  },
  laundry: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Laundry",
  },
});

//pwd hashing middleware
customerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  // console.log("hashing password", this.email);
  this.password = await bcrypt.hash(this.password, 10);
  // console.log("hashed password", this.email);
});
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  console.log("hashing password", this.email);
  this.password = await bcrypt.hash(this.password, 10);
  console.log("hashed password", this.email);
});
laundryOwnerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  console.log("hashing password", this.email);
  this.password = await bcrypt.hash(this.password, 10);
  console.log("hashed password", this.email);
});
staffSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  console.log("hashing password", this.email);
  this.password = await bcrypt.hash(this.password, 10);
  console.log("hashed password", this.email);
});

//JWT token generation
customerSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};
adminSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};
laundryOwnerSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};
staffSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};

//validating password - promise return true or false
customerSchema.methods.isValidPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
adminSchema.methods.isValidPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
laundryOwnerSchema.methods.isValidPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
staffSchema.methods.isValidPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//reset password token
customerSchema.methods.getResetToken = function () {
  //generate token
  const token = crypto.randomBytes(20).toString("hex");

  //generate hash and set to resetPasswordToken(in db)
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  //set token expire time
  this.resetPasswordTokenExpire = Date.now() + 30 * 60 * 1000;

  return token;
};
staffSchema.methods.getResetToken = function () {
  //generate token
  const token = crypto.randomBytes(20).toString("hex");

  //generate hash and set to resetPasswordToken(in db)
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  //set token expire time
  this.resetPasswordTokenExpire = Date.now() + 30 * 60 * 1000;

  return token;
};
adminSchema.methods.getResetToken = function () {
  //generate token
  const token = crypto.randomBytes(20).toString("hex");

  //generate hash and set to resetPasswordToken(in db)
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  //set token expire time
  this.resetPasswordTokenExpire = Date.now() + 30 * 60 * 1000;

  return token;
};
laundryOwnerSchema.methods.getResetToken = function () {
  //generate token
  const token = crypto.randomBytes(20).toString("hex");

  //generate hash and set to resetPasswordToken(in db)
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  //set token expire time
  this.resetPasswordTokenExpire = Date.now() + 30 * 60 * 1000;

  return token;
};

const Customer = mongoose.model("Customer", customerSchema);
const Admin = mongoose.model("Admin", adminSchema);
const LaundryOwner = mongoose.model("LaundryOwner", laundryOwnerSchema);
const Staff = mongoose.model("Staff", staffSchema);
// not working below linw=e
// const customer = new Customer();
// const token = customer.getJwtToken();

module.exports = { Customer, Admin, LaundryOwner, Staff };
