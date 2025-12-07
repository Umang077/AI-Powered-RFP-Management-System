

const mongoose = require("mongoose");
const { rfpDb } = require("../config/db");

//RFP Model layout that will be stored inside the Database

const rfpSchema = new mongoose.Schema({
  title: String,
  rawInput: String,
  structuredData: Object,
  vendorsSent: [String],
}, { timestamps: true });
module.exports = mongoose.model("Rfp", rfpSchema);

