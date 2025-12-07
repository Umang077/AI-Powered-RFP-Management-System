// import React from 'react';

// export default function Vendors() {
//   return (
//     <div>
//       <h1>Vendors</h1>
//       <p>List of vendors (placeholder).</p>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import api from "../api/api";
import VendorCard from "../components/VendorCard";

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", company: "" });

  const load = async () => {
    const res = await api.get("/vendors");
    setVendors(res.data);
  };

  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return alert("name & email required");
    await api.post("/vendors", form);
    setForm({ name: "", email: "", company: "" });
    load();
  };

  const del = async (id) => {
    if (!confirm("Delete vendor?")) return;
    await api.delete(`/vendors/${id}`);
    load();
  };

  return (
    <div style={{ maxWidth: 900 }}>
      <div className="card">
        <h3>Add Vendor</h3>
        <form onSubmit={add}>
          <label>Name</label>
          <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <label>Email</label>
          <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          <label>Company</label>
          <input value={form.company} onChange={e => setForm({...form, company: e.target.value})} />
          <button type="submit">Add Vendor</button>
        </form>
      </div>

      <div style={{ height: 12 }} />

      <div>
        <h3>All Vendors</h3>
        <div className="grid">
          {vendors.map(v => (
            <VendorCard key={v._id} vendor={v} onDelete={del} onSelect={() => {}} />
          ))}
        </div>
      </div>
    </div>
  );
}
