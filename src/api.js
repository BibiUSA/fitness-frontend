import axios from "axios";

const api = axios.create({
  baseURL: "https://bibi-fitness-api.onrender.com",
  // baseURL: "https://localhost:3001",
  withCredentials: true,
});

export default api;
