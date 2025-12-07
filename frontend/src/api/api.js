
import axios from "axios";

const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: base + "/api",
  headers: { "Content-Type": "application/json" }
});

export default api;
