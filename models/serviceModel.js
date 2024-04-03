const mongoose = require("mongoose");
const validator = require("validator");

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter the service name "],
  },
  itemsInfo: {
    items: [
      {
        type: String,
        required: [true, "Please select items "],
      },
    ],
    unitInfo: {
      unitName: {
        type: String,
        required: [true, " select the unit type"],
      },
      quantity: {
        type: Number,
        required: [true, "please specify basic quantity number"],
      },
    },
    price: {
      type: Number,
      required: [true, "Plese enter the service price"],
    },
  },

  description: {
    type: String,
    required: [true, "Plese enter the service Description"],
  },
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
