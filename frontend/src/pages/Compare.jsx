

import React, { useState } from "react";
import api from "../api/api";
import "./Compare.css"; 

const normalize = (parsed = {}) => {
  const totalCost = parsed.totalCost ?? parsed.total_price ?? parsed.total ?? parsed.totalCostUsd ?? null;
  const pricePerUnit = parsed.pricePerUnit ?? parsed.unitPrice ?? parsed.price ?? null;
  const deliveryDays =
    (parsed.deliveryDays && Number(parsed.deliveryDays)) ||
    (parsed.delivery && parseInt(String(parsed.delivery).match(/\d+/)?.[0] || "", 10)) ||
    null;
  const warranty =
    parsed.warranty ??
    parsed.warrantyPeriod ??
    parsed.warrantyYears ??
    parsed.warranty_months ??
    "";

  return {
    totalCost: totalCost ? Number(String(totalCost).replace(/[^0-9.]/g, "")) : (pricePerUnit && parsed.quantity ? pricePerUnit * parsed.quantity : null),
    pricePerUnit: pricePerUnit ? Number(String(pricePerUnit).replace(/[^0-9.]/g, "")) : null,
    deliveryDays: deliveryDays ? Number(deliveryDays) : null,
    warranty: String(warranty)
  };
};

const scoreProposal = (parsed) => {
  // parsed already normalized by normalize()
  const p = normalize(parsed);
  let score = 0;

  // Cheaper totalCost -> higher score (scale)
  if (p.totalCost && p.totalCost > 0) {
    // invert: smaller cost -> larger score
    score += Math.max(0, 100 - (p.totalCost / 1000));
  } else if (p.pricePerUnit && p.pricePerUnit > 0) {
    score += Math.max(0, 50 - (p.pricePerUnit / 1000));
  }

  // Delivery faster -> higher score
  if (p.deliveryDays) {
    score += Math.max(0, 50 - p.deliveryDays / 2);
  }

  // Warranty numeric years boost
  const wy = String(p.warranty || "").match(/(\d+)/);
  if (wy) {
    const years = parseInt(wy[1], 10);
    score += Math.min(30, years * 5);
  } else if (/lifetime|ltd/i.test(p.warranty || "")) {
    score += 20;
  }

  // completeness bonus
  const completeness = (p.totalCost || p.pricePerUnit) && p.deliveryDays && p.warranty ? 10 : 0;
  score += completeness;

  return Math.round(score);
};

export default function CompareTable() {
  const [rfpId, setRfpId] = useState("");
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [sortBy, setSortBy] = useState("score"); // score | price | delivery

  const loadProposals = async () => {
    if (!rfpId) return alert("Enter RFP ID");
    setLoading(true);
    try {
      const res = await api.get(`/proposals/rfp/${rfpId}`);
      const ps = res.data.map(p => {
        const norm = normalize(p.parsedProposal || {});
        const s = scoreProposal(p.parsedProposal || {});
        return {
          ...p,
          normalized: norm,
          score: s
        };
      });
      setProposals(ps);
      setRecommendation(null);
    } catch (err) {
      console.error(err);
      alert("Failed to load proposals");
    } finally {
      setLoading(false);
    }
  };

  const sorted = [...proposals].sort((a, b) => {
    if (sortBy === "price") {
      const aPrice = a.normalized.totalCost ?? a.normalized.pricePerUnit ?? Infinity;
      const bPrice = b.normalized.totalCost ?? b.normalized.pricePerUnit ?? Infinity;
      return aPrice - bPrice; // lower price first
    }
    if (sortBy === "delivery") {
      return (a.normalized.deliveryDays ?? 999) - (b.normalized.deliveryDays ?? 999);
    }
    return (b.score ?? 0) - (a.score ?? 0);
  });

  const requestRecommendation = async () => {
    if (!rfpId) return alert("Enter RFP ID");
    setLoading(true);
    try {
      const res = await api.post(`/recommend/${rfpId}/recommend`);
      setRecommendation(res.data);
    } catch (err) {
      console.error(err);
      alert("Recommendation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: "24px auto", fontFamily: "Inter, Arial" }}>
      <h2>Proposal Comparison</h2>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input style={{ flex: "0 0 360px", padding: 8 }} placeholder="Enter RFP ID" value={rfpId} onChange={e => setRfpId(e.target.value)} />
        <button onClick={loadProposals} disabled={loading}>Load Proposals</button>
        <button onClick={requestRecommendation} disabled={loading || proposals.length === 0}>Get AI Recommendation</button>

        <div style={{ marginLeft: "auto" }}>
          <label style={{ fontSize: 13, marginRight: 6 }}>Sort by</label>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="score">Score (recommended)</option>
            <option value="price">Price (low - high)</option>
            <option value="delivery">Delivery (fast - slow)</option>
          </select>
        </div>
      </div>

      {recommendation && (
        <div className="card" style={{ marginBottom: 12 }}>
          <h3>AI Recommendation</h3>
          <div><strong>Recommended Vendor:</strong> {recommendation.recommendedVendor}</div>
          <div style={{ marginTop: 6 }}><strong>Why:</strong> {recommendation.reason}</div>
        </div>
      )}

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid #e6e9ef" }}>
            <th style={{ padding: 8 }}>Vendor</th>
            <th style={{ padding: 8 }}>Price</th>
            <th style={{ padding: 8 }}>Delivery (days)</th>
            <th style={{ padding: 8 }}>Warranty</th>
            <th style={{ padding: 8 }}>Score</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(p => (
            <tr key={p._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
              <td style={{ padding: 8 }}>
                <div style={{ fontWeight: 600 }}>{p.vendorName || p.vendorEmail || "Unknown"}</div>
                <div className="small">{p.vendorEmail}</div>
              </td>
              <td style={{ padding: 8 }}>
                {p.normalized.totalCost ?? (p.normalized.pricePerUnit ? `${p.normalized.pricePerUnit} / unit` : "—")}
              </td>
              <td style={{ padding: 8 }}>{p.normalized.deliveryDays ?? "—"}</td>
              <td style={{ padding: 8 }}>{p.normalized.warranty || "—"}</td>
              <td style={{ padding: 8 }}>{p.score}</td>
            </tr>
          ))}
          {sorted.length === 0 && (
            <tr><td colSpan={5} style={{ padding: 12, textAlign: "center", color: "#6b7280" }}>No proposals found for this RFP</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
