import axios from "axios";

// Set the base URL for axios based on the environment. In development, it will point to our backend server running on localhost:5001, and in production, it will point to the relative path /api, which will be handled by our backend server when we serve our frontend build files.
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;