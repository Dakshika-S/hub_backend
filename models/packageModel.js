const mongoose = require("mongoose");
const validator = require("validator");

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide package title"],
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
