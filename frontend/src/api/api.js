// const BASE_URL = import.meta.env.VITE_API_BASE || '/api';

// async function request(path, options = {}) {
//   const res = await fetch(`${BASE_URL}${path}`, {
//     headers: { 'Content-Type': 'application/json' },
//     ...options,
//   });

//   if (!res.ok) {
//     const text = await res.text();
//     throw new Error(text || res.statusText);
//   }

//   return res.status === 204 ? null : res.json();
// }

// export const api = {
//   get: (path) => request(path, { method: 'GET' }),
//   post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
//   put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
//   del: (path) => request(path, { method: 'DELETE' }),
// };

import axios from "axios";

const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: base + "/api",
  headers: { "Content-Type": "application/json" }
});

export default api;
