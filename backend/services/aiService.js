// const { openai } = require("../config/openai.js");

// const parseRfpText = async (text) => {
//   const prompt = `
// Convert the following procurement requirement into structured JSON:

// "${text}"

// Include:
// - items (name, qty, specs)
// - budget
// - deliveryTimeline
// - paymentTerms
// - warranty
// `;

//   const res = await openai.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages: [{ role: "user", content: prompt }]
//   });

//   return JSON.parse(res.choices[0].message.content);
// };

// const parseVendorEmail = async (emailText) => {
//   const prompt = `
// Extract structured proposal data from this vendor email:

// "${emailText}"

// Return JSON with:
// - prices
// - terms
// - delivery
// - warranty
// - totalCost
// `;

//   const res = await openai.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages: [{ role: "user", content: prompt }]
//   });

//   return JSON.parse(res.choices[0].message.content);
// };

// module.exports = { parseRfpText, parseVendorEmail };

//final code 1
// const { openai } = require("../config/openai");

// exports.parseRfpText = async (text) => {
//   const prompt = `
// Convert this procurement requirement into structured JSON:

// ${text}

// Return ONLY valid JSON.
// `;

//   const response = await openai.responses.create({
//     model: "gpt-4o-mini",
//     input: prompt
//   });

//   const output = response.output[0].content[0].text;

//   try {
//     return JSON.parse(output);
//   } catch (err) {
//     console.log("AI JSON parse error:", output);
//     throw new Error("AI returned invalid JSON");
//   }
// };

// output is coming incorrect so updating the code
// const openai = require("../config/openai");

// exports.parseRfpText = async (text) => {
//   const prompt = `
// Convert this procurement requirement into structured JSON.

// ${text}

// Return ONLY valid JSON.
// `;

//   // NEW OpenAI SDK (Responses API)
//   const response = await openai.responses.create({
//     model: "gpt-4o-mini",
//     input: prompt
//   });

//   // Safest way to extract text for all new models
//   const output = response.output_text;

//   console.log("AI Output:", output);

//   try {
//     return JSON.parse(output);
//   } catch (err) {
//     console.log("JSON Parse Failed. Output was:", output);
//     throw new Error("AI returned invalid JSON");
//   }
// };


//correct code
const openai = require("../config/openai");

exports.parseRfpText = async (text) => {
  const prompt = `
Convert this procurement requirement into structured JSON.

${text}

Return ONLY valid JSON. Do not include markdown, explanation, or code fences.
`;

  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    input: prompt
  });

  let output = response.output_text;

  console.log("AI RAW OUTPUT:", output);

  // 🟩 Remove markdown ```json and ``` to get clean JSON
  output = output
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    const parsed = JSON.parse(output);
    return parsed;
  } catch (err) {
    console.log("JSON Parse FAILED. Cleaned output was:", output);
    throw new Error("AI returned invalid JSON");
  }
};

exports.parseVendorEmail = async (emailText) => {
  const prompt = `
Extract vendor proposal details from the following email text:

"${emailText}"

Return ONLY valid JSON with this structure:

{
  "pricePerUnit": number,
  "totalCost": number,
  "deliveryDays": number,
  "warranty": "string",
  "notes": "string"
}

Return only JSON. Do NOT include markdown.
`;

  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    input: prompt
  });

  let output = response.output_text;

  output = output
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(output);
  } catch (err) {
    console.log("Vendor Email JSON Parse Failed. Raw output:", output);
    throw new Error("Vendor email invalid JSON");
  }
};
