const mongoose = require("mongoose");
const validator = require("validator");

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide package title"],
    unique: true,
  },

  serviceIncluded: [
    {
      service: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "select one or more services"],
        ref: "Service",
      },
      options: {
        type: Map,
        of: String,
      },
    },
  ],
});

const Package = mongoose.model("Package", packageSchema);

module.exports = Package;
