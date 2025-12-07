
const openai = require("../config/openai");

// Prompt to Parse RFP text while creating Proposal by the user in Create RPF Page
// returns JSON format layout to be showed to the user as well stored into dtabase
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

// Parsing important details from the vendor reply using ai prompt
// this extract only the relevant informtion from the reply and show parsed proposal reply from the vendor

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

  //removing ``` from the response that was shown while I was console logging, 
  // so I had to remove ``` from the output
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
