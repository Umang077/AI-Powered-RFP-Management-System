const express = require("express");
const { sendRfpToVendors } = require("../controllers/rfpController.js");
const { processEmails } = require("../controllers/emailController.js");
const { readVendorEmails } = require("../services/emailService");

const router = express.Router();

// Send RFP emails
router.post("/send", sendRfpToVendors);

// Receive & parse emails

router.get("/receive", async (req, res) => {
  try {
    // reading vendor function - using IMAP and extracting the latest unread vendor reply infortmation using AI from the replies of the vendor
    await readVendorEmails();
    res.json({ message: "Vendor emails processed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;


module.exports = router;
