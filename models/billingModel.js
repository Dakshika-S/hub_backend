const mongoose = require("mongoose");
const validator = require("validator");

const billingSchema = new mongoose.Schema({
  invoiceNo: {
    type: String,
    required: true,
    unique: true,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Order",
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Customer",
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ["Pending", "Completed", "refunded"],
  },
  additonalDetails: {
    type: Map,
    of: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Billing = mongoose.model("Billing", billingSchema);
