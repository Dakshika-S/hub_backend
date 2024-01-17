const mongoose = require("mongoose");
const validator = require("validator");

const laundrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter the Laundry name"],
  },
  reg_no: {
    type: String,
    required: [true, "Please enter the Business Reg No"],
  },
  area: {
    type: String,
    required: [true, "Please enter the Business area"],
  },
  services: {
    type: String,
    required: true,
  },
});

const Laundry = mongoose.model("Laundry", laundrySchema);

module.exports = Laundry;
