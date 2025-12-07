const Proposal = require("../models/Proposal.js");
const Vendor = require("../models/Vendor.js");
const { readVendorEmails } = require("../services/emailService.js");
const { parseVendorEmail } = require("../services/aiService.js");

const processEmails = async (req, res) => {
  try {
    // this will read the vendor emails and store into email variable
    const emails = await readVendorEmails();


    for (let raw of emails) {
      //parsing of email is being done by ai to extract the important details from the reply
      const parsed = await parseVendorEmail(raw);

      //stored inside the into database for fetching and using in compare page
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
