import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const AdminToken = localStorage.getItem("AdminToken");
  if (AdminToken) {
    config.headers.Authorization = `Bearer ${AdminToken}`;
  }
  return config;
});

export default axiosInstance;
