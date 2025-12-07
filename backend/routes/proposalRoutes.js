const express = require("express");
const { getProposalsByRfp, getAllProposals } = require("../controllers/proposalController.js");

const router = express.Router();

// Get proposals for a specific RFP
router.get("/rfp/:rfpId", getProposalsByRfp);

// Get all proposals
router.get("/", getAllProposals);

module.exports = router;
