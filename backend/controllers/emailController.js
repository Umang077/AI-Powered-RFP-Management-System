const Proposal = require("../models/Proposal.js");
const Vendor = require("../models/Vendor.js");
const { readVendorEmails } = require("../services/emailService.js");
const { parseVendorEmail } = require("../services/aiService.js");

const processEmails = async (req, res) => {
  try {
    const emails = await readVendorEmails();

    for (let raw of emails) {
      const parsed = await parseVendorEmail(raw);

      await Proposal.create({
        rawEmail: raw,
        parsedProposal: parsed
      });
    }

    res.json({ message: "Emails processed", count: emails.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { processEmails };
