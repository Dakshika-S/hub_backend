const mongoose = require("mongoose");
const validator = require("validator");

///areaSchema
const areaSchema = new mongoose.Schema({
  areaName: {
    type: String,
    require: [true, "Please enter the area name"],
  },
  district: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "District",
  }, 
});

///districtSchema
const districtSchema = new mongoose.Schema({
  districtName: {
    type: String,
    require: [true, "Please enter the district name "],
  },
});

const District = mongoose.model("District", districtSchema);
const Area = mongoose.model("Area", areaSchema);

module.exports = { District, Area };
