import { decryptData } from "@/utils/functions";
import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const storedToken = Cookies.get("token");

  if (storedToken) {
    const token = decryptData(storedToken);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
