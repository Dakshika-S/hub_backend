const mongoose = require("mongoose");
const validator = require("validator");

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter the service name "],
  },
  description: {
    type: String,
    required: [true, "Plese enter the service Descrioption"],
  },
  price: {
    type: Number,
    required: [true, "Plese enter the service price"],
  },
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
