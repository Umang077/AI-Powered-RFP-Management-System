

const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10
    });

    console.log(" MongoDB connected");

  } catch (error) {
    console.error(" MongoDB Error:", error);
    process.exit(1);
  }
};

module.exports = { connectDB };
