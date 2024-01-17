const mongoose = require("mongoose");
const validator = require("validator");

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    address: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      requied: true,
    },
    area: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Customer",
  },
  serviceType: {
    type: String,
    required: true,
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
  shippingPrice: {
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
  DeliverDate: {
    type: Date,
  },
  orderStatus: {
    type: String,
    required: true,
    Default: "Processing",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
