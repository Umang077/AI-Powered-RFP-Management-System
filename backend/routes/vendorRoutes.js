const express = require("express");
const { addVendor, getVendors, deleteVendor } = require("../controllers/vendorController.js");

const router = express.Router();

// Add a new vendor
router.post("/", addVendor);

// Get all vendors
router.get("/", getVendors);

// Delete vendor
router.delete("/:id", deleteVendor);

module.exports = router;
