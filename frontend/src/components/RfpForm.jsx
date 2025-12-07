
import React, { useState } from "react";


//RFP Form Creating
export default function RfpForm({ onCreate }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return alert("Please enter RFP description");
    setLoading(true);
    try {
      await onCreate(text);
      setText("");
    } catch (err) {
      console.error(err);
      alert("Error creating RFP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <form onSubmit={submit}>
        <label>Describe procurement needs (natural language)</label>
        <textarea
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='e.g. "Need 20 laptops with 16GB RAM and 15 monitors 27-inch. Budget $50k. Delivery 30 days. Net 30."'
        />
        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" style={{ padding: "8px 12px" }} disabled={loading}>
            {loading ? "Creating..." : "Create RFP (AI)"}
          </button>
        </div>
      </form>
    </div>
  );
}
