

const express = require("express");
const router = express.Router();

const {
  createRfp,
  sendRfpToVendors,
} = require("../controllers/rfpController");
//Create RFP Route
router.post("/create", createRfp);
//Create RFP Vendor Route

router.post("/send", sendRfpToVendors);

module.exports = router;
