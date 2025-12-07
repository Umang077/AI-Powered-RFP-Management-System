

const mongoose = require("mongoose");
const { vendorDb } = require("../config/db");

//Vendor Model layout that will be stored inside the Database

const vendorSchema = new mongoose.Schema({
  name: String,
  email: String,
  company: String,
  category: String
});
module.exports = mongoose.model("Vendor", vendorSchema);

