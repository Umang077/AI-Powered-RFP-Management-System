

const mongoose = require("mongoose");
const { vendorDb } = require("../config/db");

const vendorSchema = new mongoose.Schema({
  name: String,
  email: String,
  company: String,
  category: String
});
module.exports = mongoose.model("Vendor", vendorSchema);

