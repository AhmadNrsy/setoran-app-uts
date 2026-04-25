import axios from "axios";
import { getToken } from "./authService";

const apiClient = axios.create({
  baseURL: "https://api.tif.uin-suska.ac.id/setoran-dev/v1",
});

// 🔐 AUTO HEADER TOKEN
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      console.warn("Token expired, redirect login...");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(err);
  }
);

export default apiClient;