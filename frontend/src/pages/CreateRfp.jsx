
import React, { useState } from "react";
import RfpForm from "../components/RfpForm";
import api from "../api/api";

export default function CreateRfp() {
  const [rfp, setRfp] = useState(null);

  const handleCreate = async (text) => {
    const res = await api.post("/rfp/create", { text });
    setRfp(res.data);
  };

  return (
    <div style={{ maxWidth: 900 }}>
      <RfpForm onCreate={handleCreate} />
      <div style={{ height: 12 }} />
      {rfp && (
        <div className="card">
          <h3>Structured RFP</h3>
          <div className="small">RFP ID: {rfp._id}</div>
          <pre style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>{JSON.stringify(rfp.structuredData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
