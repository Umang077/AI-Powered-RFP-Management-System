
//Vendor Card Basic layout shown while creating vendor
export default function VendorCard({ vendor, onDelete, onSelect, selected }) {
  return (
    <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <strong>{vendor.name}</strong>
        <div className="small">{vendor.company} • {vendor.email}</div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input type="checkbox" checked={!!selected} onChange={e => onSelect(vendor, e.target.checked)} />
        <button onClick={() => onDelete(vendor._id)} style={{ background: "#fee", borderRadius: 6, padding: "6px 8px" }}>
          Delete
        </button>
      </div>
    </div>
  );
}
