const mongoose = require("mongoose");
const validator = require("validator");

const laundrySchema = new mongoose.Schema({
  laundryName: {
    type: String,
    required: [true, "Please enter the Laundry name"],
  },
  laundryOwner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "LaundryOwner",
  },
  area: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Area",
  },
  regNo: {
    type: String,
    required: [true, "Please enter the Business Reg No"],
  },

  ratings: {
    type: String,
    deffault: 0,
  },
  selectedServices: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Please select service catergory"],
    },
  ],
  numOfReviews: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Laundry = mongoose.model("Laundry", laundrySchema);

module.exports = Laundry;
