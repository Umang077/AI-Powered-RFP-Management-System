const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");

// Load environment variables
dotenv.config();

// DB connection
const { connectDB } = require("./config/db.js");
connectDB();

// Import routes (CommonJS style)
const rfpRoutes = require("./routes/rfpRoutes.js");
const vendorRoutes = require("./routes/vendorRoutes.js");
const emailRoutes = require("./routes/emailRoutes.js");
const proposalRoutes = require("./routes/proposalRoutes.js");
const recommendRoutes = require("./routes/recommendRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());

// Routes
app.use("/api/rfp", rfpRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/emails", emailRoutes);
app.use("/api/proposals", proposalRoutes);
app.use("/api/recommend", recommendRoutes);

// Server
app.listen(5000, () => console.log("Server running on port 5000"));

module.exports = app;
