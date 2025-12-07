// const mongoose = require("mongoose");

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("MongoDB Connected");
//   } catch (err) {
//     console.error(err);
//     process.exit(1);
//   }
// };

// module.exports = { connectDB };


// const mongoose = require("mongoose");
// const dotenv = require("dotenv");

// // Load env variables
// dotenv.config();

// // MASTER connection string (must exist in your .env)
// const MONGO_URI = process.env.MONGO_URI;

// if (!MONGO_URI) {
//   console.error("❌ ERROR: MONGO_URI is missing in .env");
//   process.exit(1);
// }

// const connectDB = async () => {
//   try {
//     await mongoose.connect(MONGO_URI, {
//       autoIndex: true,
//       maxPoolSize: 10,
//     });

//     console.log("✅ Connected to MongoDB server successfully");

//     // -----------------------------
//     // MULTI-DATABASE SETUP
//     // -----------------------------

//     // Main collections:
//     const rfpDb = mongoose.connection.useDb("rfps");
//     const vendorDb = mongoose.connection.useDb("vendors");
//     const proposalDb = mongoose.connection.useDb("proposals");
//     const logsDb = mongoose.connection.useDb("logs");

//     console.log("📁 Databases initialized:");
//     console.log(" - rfps");
//     console.log(" - vendors");
//     console.log(" - proposals");
//     console.log(" - logs");

//     // Export DBs
//     module.exports.rfpDb = rfpDb;
//     module.exports.vendorDb = vendorDb;
//     module.exports.proposalDb = proposalDb;
//     module.exports.logsDb = logsDb;

//   } catch (err) {
//     console.error("❌ MongoDB connection error:", err);
//     process.exit(1);
//   }
// };

// module.exports.connectDB = connectDB;


const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10
    });

    console.log("✅ MongoDB connected");

  } catch (error) {
    console.error("❌ MongoDB Error:", error);
    process.exit(1);
  }
};

module.exports = { connectDB };
