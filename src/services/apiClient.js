import axios from "axios";
import { getToken } from "./authService";

const apiClient = axios.create({
  // Otomatis nyesuain environment!
  baseURL: window.location.origin.includes("vercel.app") 
    ? "/api-kampus" 
    : import.meta.env.VITE_API_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default apiClient;