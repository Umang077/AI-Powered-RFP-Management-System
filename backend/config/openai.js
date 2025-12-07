// // OpenAI configuration
// module.exports = {
//   // Add your OpenAI configuration here
// };

// import OpenAI from "openai";

// export const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

// const OpenAI = require("openai");

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

// module.exports = openai;

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
