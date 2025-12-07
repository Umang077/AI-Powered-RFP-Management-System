const Vendor = require("../models/Vendor.js");

const addVendor = async (req, res) => {
  try {
    const vendor = await Vendor.create(req.body);
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteVendor = async (req, res) => {
  try {
    await Vendor.findByIdAndDelete(req.params.id);
    res.json({ message: "Vendor deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addVendor, getVendors, deleteVendor };
