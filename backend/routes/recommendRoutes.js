const express = require("express");
const router = express.Router();
const { recommendForRfp } = require("../controllers/recommendController");

// Recommend Route
router.post("/:id/recommend", recommendForRfp);

module.exports = router;
