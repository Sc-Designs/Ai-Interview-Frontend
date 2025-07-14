import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const UserToken = localStorage.getItem("UserToken");
  if (UserToken) {
    config.headers.Authorization = `Bearer ${UserToken}`;
  }
  return config;
});

export default axiosInstance;
