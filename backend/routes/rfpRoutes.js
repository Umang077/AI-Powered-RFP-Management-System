// const express = require("express");
// const { createRfp } = require("../controllers/rfpController.js");

// const router = express.Router();

// router.post("/create", createRfp);

// module.exports = router;

const express = require("express");
const router = express.Router();

const {
  createRfp,
  sendRfpToVendors,
} = require("../controllers/rfpController");

router.post("/create", createRfp);
router.post("/send", sendRfpToVendors);

module.exports = router;
