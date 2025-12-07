const Rfp = require("../models/Rfp");
const Proposal = require("../models/Proposal");
const openai = require("../config/openai");
function scoreProposal(parsed) {
  if (!parsed) return 0;
  let score = 0;

  // calculates the total points for each vendor
  // scores the highest point to cost by given the base priority as 100
  const total = parsed.totalCost || parsed.total || parsed.pricePerUnit && parsed.pricePerUnit * 1 || 0;
  if (total) {
    score += Math.max(0, 100 - (total / 1000));
  }
  // delivery is given the second highest priority by given the base priority as 50
  const delivery = parsed.deliveryDays || parsed.delivery || null;
  if (delivery) {
    const days = parseInt(String(delivery).match(/\d+/)?.[0] || 999, 10);
    score += Math.max(0, 50 - days / 2);
  }
  // warranty is given the third highest priority by given the base priority as 30

  const warranty = String(parsed.warranty || "");
  const wy = (warranty.match(/(\d+)/) || [])[0];
  if (wy) score += Math.min(30, parseInt(wy, 10) * 5);

  const keys = Object.keys(parsed || {});
  if (keys.length >= 3) score += 10;
  // returning total point for each vendor that is cost + delivery + warranty points
  return Math.round(score);
}

exports.recommendForRfp = async (req, res) => {
  try {
    const { id } = req.params;
    const rfp = await Rfp.findById(id);
    if (!rfp) return res.status(404).json({ error: "RFP not found" });

    const proposals = await Proposal.find({ rfpId: id });
    if (!proposals || proposals.length === 0) return res.status(404).json({ error: "No proposals found" });

    // compute scores
    const scored = proposals.map(p => {
      const parsed = p.parsedProposal || {};
      return {
        _id: p._id,
        vendorId: p.vendorId,
        vendorName: p.vendorName || p.vendorEmail,
        parsedProposal: parsed,
        score: scoreProposal(parsed)
      };
    });

    // sort top -> bottom
    scored.sort((a, b) => b.score - a.score);

    // Prepared prompt for AI recommendation (concise)
    const prompt = `
You are a procurement advisor. Given one RFP and N proposals below, recommend the best vendor and explain briefly (3-5 lines) why.

RFP:
${JSON.stringify(rfp.structuredData, null, 2)}

Proposals:
${JSON.stringify(scored, null, 2)}

Return a JSON with:
{
  "recommendedVendor": "<vendorName>",
  "recommendedVendorId": "<vendorId or null>",
  "reason": "<short explanation>",
  "ranked": [ /* the scored array as above */ ]
}
Return ONLY valid JSON.
`;

    // call OpenAI Responses API (safe extraction)
    const aiRes = await openai.responses.create({
      model: "gpt-4o-mini",
      input: prompt
    });

    let aiOutput = aiRes.output_text || (aiRes.output?.[0]?.content?.[0]?.text) || "";
    aiOutput = aiOutput.replace(/```json/gi, "").replace(/```/g, "").trim();

    let recommendation;
    try {
      recommendation = JSON.parse(aiOutput);
    } catch (e) {
      recommendation = {
        recommendedVendor: scored[0].vendorName,
        recommendedVendorId: scored[0].vendorId || null,
        reason: `Chose ${scored[0].vendorName} based on highest score (${scored[0].score}).`,
        ranked: scored
      };
    }

    rfp.recommendation = recommendation;
    await rfp.save();

    res.json(recommendation);
  } catch (err) {
    console.error("Recommend error:", err);
    res.status(500).json({ error: err.message });
  }
};
