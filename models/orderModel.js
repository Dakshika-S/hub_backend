const mongoose = require("mongoose");
const validator = require("validator");

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    address: {
      type: String,
      required: true,
    },
    district: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    area: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    contactNo: {
      type: String,
      required: true,
    },
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Customer",
  },
  selectedPackage: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Please select a package"],
  },
  Items: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  pickupandDeliveryCharge: {
    type: Number,
    required: true,
    default: 0.0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  paidAt: {
    type: Date,
  },
  pickupDate: {
    type: Date,
  },
  deliverDate: {
    type: Date,
  },
  orderStatus: {
    type: String,
    required: true,
    default: "Processing",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
