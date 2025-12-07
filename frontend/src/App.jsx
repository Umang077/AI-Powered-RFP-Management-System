import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import CreateRfp from "./pages/CreateRfp";
import Vendors from "./pages/Vendors";
import SendRfp from "./pages/SendRfp";
import Proposals from "./pages/Proposals";
import Compare from "./pages/Compare";

 // Files being called here
 
export default function App() {
  return (
    <div style={{ fontFamily: "Inter, Arial, sans-serif", padding: 20 }}>
      <header style={{ marginBottom: 20 }}>
        <h1>AI-powered RFP Manager</h1>
        <nav style={{ display: "flex", gap: 12 }}>
          <Link to="/">Create RFP</Link>
          <Link to="/vendors">Vendors</Link>
          <Link to="/send">Send RFP</Link>
          <Link to="/proposals">Proposals</Link>
          <Link to="/compare">Compare</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<CreateRfp />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/send" element={<SendRfp />} />
          <Route path="/proposals" element={<Proposals />} />
          <Route path="/compare" element={<Compare />} />
        </Routes>
      </main>
    </div>
  );
}
