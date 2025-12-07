
import axios from "axios";

//port number 5000 is being used and localhost:5000 if base_url not provided
const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: base + "/api",
  headers: { "Content-Type": "application/json" }
});

export default api;
