const express = require("express");
const { sendRfpToVendors } = require("../controllers/rfpController.js");
const { processEmails } = require("../controllers/emailController.js");
const { readVendorEmails } = require("../services/emailService");

const router = express.Router();

// Send RFP emails
router.post("/send", sendRfpToVendors);

// Receive & parse emails
// router.get("/receive", processEmails);

router.get("/receive", async (req, res) => {
  try {
    await readVendorEmails();
    res.json({ message: "Vendor emails processed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;


module.exports = router;
