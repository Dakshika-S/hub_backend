const mongoose = require("mongoose");

const performancereportSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true,
  },

  totalIncome: {
    type: Number,
    required: true,
  },

  servicesDone: [
    {
      service: String,
      quantity: Number,
      income: Number,
    },
  ],
  totalOrders: {
    type: Number,
    required: true,
  },
});

const PerformanceReport = mongoose.model(
  "PerformanceReport",
  performancereportSchema
);
module.exports = PerformanceReport;
