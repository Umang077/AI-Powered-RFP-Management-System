

const OpenAI = require("openai");
require("dotenv").config();

let client;

try {
  client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} catch (err) {
  console.error("OpenAI init error:", err);
}

module.exports = client;
