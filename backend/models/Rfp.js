

const mongoose = require("mongoose");
const { rfpDb } = require("../config/db");

const rfpSchema = new mongoose.Schema({
  title: String,
  rawInput: String,
  structuredData: Object,
  vendorsSent: [String],
}, { timestamps: true });
module.exports = mongoose.model("Rfp", rfpSchema);

