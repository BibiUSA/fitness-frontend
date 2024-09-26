import axios from "axios";

const api = axios.create({
  baseURL: "https://fitness-backend-je4w.onrender.com",
  // baseURL: "https://localhost:3001",
  withCredentials: true,
});

export default api;

// baseURL: "https://bibi-fitness-api.onrender.com",
