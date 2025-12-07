

import React, { useEffect, useState } from "react";
import api from "../api/api";
import VendorCard from "../components/VendorCard";

//SendRfp Page Layout
export default function SendRfp() {
  const [vendors, setVendors] = useState([]);
  const [rfps, setRfps] = useState([]);
  const [selected, setSelected] = useState({});
  const [selectedRfp, setSelectedRfp] = useState(null);
  const [sending, setSending] = useState(false);

  // loaded all vendors and all created RFPs once when the page loads.
  // this initializes the dropdown (RFP IDs) and vendor list for selection.

    useEffect(() => { 
      loadVendors(); 
      loadRfps(); 
    }, []);

    //loadVendor function calls /vendor api
  const loadVendors = async () => {
    const res = await api.get("/vendors");
    setVendors(res.data);
  };
    //loadRfps function calls /rfp api

  const loadRfps = async () => {
    const res = await api.get("/rfp"); 
    if (res.status === 200) setRfps(res.data);
  };

  // add or remove a vendor from the "selected" list when user checks/unchecks the card.
  // we store selected vendors in an object for quick lookup by vendor ID.
  const toggleSelect = (vendor, checked) => {
    setSelected(prev => {
      const copy = { ...prev };
      if (checked) copy[vendor._id] = vendor;
      else delete copy[vendor._id];
      return copy;
    });
  };

  // sends the selected RFP to all chosen vendors and validates that an RFP and at least one vendor are selected,
// then calls the backend email API and resets the selection state.
  const doSend = async () => {
    if (!selectedRfp) return alert("Pick an RFP to send");
    const vendorIds = Object.keys(selected);
    if (!vendorIds.length) return alert("Select at least one vendor");
    setSending(true);
    try {
      await api.post("/emails/send", { rfpId: selectedRfp, vendorIds });
      alert("RFP sent to selected vendors");
      setSelected({});
    } catch (err) {
      console.error(err);
      alert("Error sending RFP");
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ maxWidth: 1000 }}>
      <div className="card">
        <h3>Send RFP to Vendors</h3>
        <div style={{ marginBottom: 8 }}>
          <label>Select RFP (choose a created RFP ID)</label>
          <input placeholder="Enter RFP ID" value={selectedRfp || ""} onChange={e => setSelectedRfp(e.target.value)} />
          <div className="small">(You can paste the RFP ID shown after creating an RFP.)</div>
        </div>

        <div>
          <h4>Vendors</h4>
          <div className="grid">
            {vendors.map(v => (
              <VendorCard key={v._id}
                vendor={v}
                onDelete={async id => { await api.delete(`/vendors/${id}`); loadVendors(); }}
                onSelect={toggleSelect}
                selected={!!selected[v._id]}
              />
            ))}
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <button onClick={doSend} disabled={sending}>{sending ? "Sending..." : "Send RFP Emails"}</button>
        </div>
      </div>
    </div>
  );
}
