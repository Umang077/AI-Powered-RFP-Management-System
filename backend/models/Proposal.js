// const mongoose = require("mongoose");

// const proposalSchema = new mongoose.Schema({
//   rfpId: String,
//   vendorId: String,
//   rawEmail: String,
//   parsedProposal: Object
// });

// module.exports = mongoose.model("Proposal", proposalSchema);

const mongoose = require("mongoose");
const { proposalDb } = require("../config/db");

const proposalSchema = new mongoose.Schema({
  rfpId: { type: String, required: true },
  vendorId: String,
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", default: null },
  vendorEmail: String,
  vendorName: { type: String, default: "unknown" },
  rawEmail: String,
  parsedProposal: Object,
}, { timestamps: true });

module.exports = mongoose.model("Proposal", proposalSchema);

// module.exports = proposalDb.model("Proposal", proposalSchema);
