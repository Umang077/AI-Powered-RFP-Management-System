
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
