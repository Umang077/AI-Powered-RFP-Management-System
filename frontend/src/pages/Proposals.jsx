
import React, { useState } from "react";
import api from "../api/api";

export default function Proposals() {
  const [rfpId, setRfpId] = useState("");
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingReplies, setFetchingReplies] = useState(false);

  // Load proposals from DB on button click
  const loadProposals = async () => {
    if (!rfpId.trim()) return alert("Enter RFP ID");
    setLoading(true);
    try {
      const res = await api.get(`/proposals/rfp/${rfpId}`);
      setProposals(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching proposals");
    } finally {
      setLoading(false);
    }
  };

  // Fetch latest unread vendor reply using IMAP then parse with AI and then save to DB
  const fetchVendorReplies = async () => {
    setFetchingReplies(true);
    try {
      await api.get("/emails/receive");        // trigger backend IMAP + parsing api
      await loadProposals();                   // reload proposals after new ones saved
      alert("Checked inbox for new vendor replies!");
    } catch (err) {
      console.error(err);
      alert("Failed to fetch vendor replies");
    } finally {
      setFetchingReplies(false);
    }
  };

  //Basic UI Structure
  return (
    <div style={{ maxWidth: 900, margin: "auto", fontFamily: "Inter, sans-serif" }}>
      <div className="card" style={{ padding: 16 }}>
        <label style={{ fontWeight: 600 }}>Enter RFP ID to view proposals</label>
        <input
          value={rfpId}
          onChange={e => setRfpId(e.target.value)}
          style={{ marginBottom: 8 }}
        />

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={loadProposals} disabled={loading}>
            {loading ? "Loading..." : "Load Proposals"}
          </button>

          <button onClick={fetchVendorReplies} disabled={fetchingReplies}>
            {fetchingReplies ? "Fetching..." : "Fetch Vendor Replies"}
          </button>
        </div>
      </div>

      <div style={{ height: 16 }} />

      {proposals.length === 0 ? (
        <div className="small" style={{ fontSize: 14, color: "#6b7280" }}>
          No proposals found. After sending RFPs, click "Fetch Vendor Replies" to process new vendor emails.
        </div>
      ) : (
        <div className="grid" style={{ display: "grid", gap: 12 }}>
          {proposals.map(p => (
            <div key={p._id} className="card" style={{ padding: 16 }}>
              <div style={{ marginBottom: 6 }}>
                <strong>Vendor:</strong> {p.vendorName || p.vendorEmail || "Unknown"}
              </div>

              <div style={{ fontWeight: 600 }}>Parsed Proposal:</div>
              <pre style={{ whiteSpace: "pre-wrap", marginTop: 6 }}>
                {JSON.stringify(p.parsedProposal || {}, null, 2)}
              </pre>

              <div style={{ marginTop: 12, fontWeight: 600 }}>Raw Email (truncated):</div>
              <pre
                style={{
                  maxHeight: 120,
                  overflowY: "auto",
                  whiteSpace: "pre-wrap",
                  marginTop: 6
                }}
              >
                {(p.rawEmail || "").slice(0, 2000)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


// import React, { useState } from "react";
// import api from "../api/api";

// export default function Proposals() {
//   const [rfpId, setRfpId] = useState("");
//   const [proposals, setProposals] = useState([]);

//   const loadProposals = async () => {
//     if (!rfpId.trim()) return alert("Enter RFP ID");

//     const res = await api.get(`/proposals/rfp/${rfpId}`);
//     setProposals(res.data);
//   };

//   return (
//     <div style={{ maxWidth: 900, margin: "auto" }}>
//       <h2>Proposals for RFP</h2>

//       <input
//         placeholder="Enter RFP ID"
//         value={rfpId}
//         onChange={(e) => setRfpId(e.target.value)}
//         style={{ width: "300px" }}
//       />

//       <button onClick={loadProposals}>Load</button>

//       <div style={{ marginTop: 20 }}>
//         {proposals.map((p) => (
//           <div key={p._id} className="card">
//             <h3>Vendor: {p.vendorEmail}</h3>
//             <pre>{JSON.stringify(p.parsedProposal, null, 2)}</pre>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

