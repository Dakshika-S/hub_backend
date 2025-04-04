const mongoose = require("mongoose");
const validator = require("validator");
const Joi = require("joi");

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
    required: [true, "  package is required"],
  },
  itemsOrdered: [
    {
      item: {
        type: String,
        required: true,
      },
      count: {
        type: Number,
        required: true,
        min: [1, "Items count must be at least 1"],
      },
    },
  ],
  totWeight: {
    type: Number,
    required: true,
    min: [0, "total weight should be at leat 0 "],
  },
  itemsTotPrice: {
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
    enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
