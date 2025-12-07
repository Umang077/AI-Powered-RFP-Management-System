const Proposal = require("../models/Proposal.js");

const getProposalsByRfp = async (req, res) => {
  try {
    const { rfpId } = req.params;
    // fetcghes the proposals by particular id
    console.log("Fetching proposals for RFP ID:", rfpId);
    const proposals = await Proposal.find({ rfpId });
    res.json(proposals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllProposals = async (req, res) => {
  try {
    //fetches all proposal but didn't call it anywhere, thought to use it for future.
    const proposals = await Proposal.find();
    res.json(proposals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getProposalsByRfp, getAllProposals };
