import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const OrgToken = localStorage.getItem("OrgToken");
  if (OrgToken) {
    config.headers.Authorization = `Bearer ${OrgToken}`;
  }
  return config;
});

export default axiosInstance;
