const mongoose = require("mongoose");
const validator = require("validator");
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

const baseUserSchema = {
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
    maxlength: [6, "password cannot exceed 6 characters"],
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
  role: {
    type: String,
    default: "user",
  },
};

const customerSchema = new mongoose.Schema({
  ...baseUserSchema,
});
const adminSchema = new mongoose.Schema({
  ...baseUserSchema,
});

const laundryOwnerSchema = new mongoose.Schema({
  ...baseUserSchema,

  l_contact_person_name: {
    type: String,
  },
  laundry: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Laundry",
  },
});

const staffSchema = new mongoose.Schema({
  ...baseUserSchema,
  s_nic: {
    type: String,
    required: [true, "Please enter the NIC Number"],
  },
  laundry: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Laundry",
  },
});

const Customer = mongoose.model("Customer", customerSchema);
const Admin = mongoose.model("Admin", adminSchema);
const LaundryOwner = mongoose.model("LaundryOwner", laundryOwnerSchema);
const Staff = mongoose.model("Staff", staffSchema);

module.exports = { Customer, Admin, LaundryOwner, Staff };
