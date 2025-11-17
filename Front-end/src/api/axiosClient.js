import axios from "axios";

// 🔗 API_URL đến từ file .env hoặc .env.local
const API_URL = import.meta.env.VITE_API_URL;

console.log("🔗 FE đang dùng API:", API_URL);

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // FE gửi cookie refreshToken
  timeout: 10000,
});

// ========= REQUEST =========
axiosClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// ========= RESPONSE + REFRESH TOKEN LOGIC =========
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, data) => {
  failedQueue.forEach((prom) => {
    error ? prom.reject(error) : prom.resolve(data);
  });
  failedQueue = [];
};

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) return Promise.reject(error);

    // tránh loop khi refresh lỗi
    if (originalRequest.url.includes("/auth/refresh-token")) {
      return Promise.reject(error);
    }

    // Kiểm tra refreshToken trong cookie
    const hasRefresh = document.cookie.includes("refreshToken=");
    if (!hasRefresh) return Promise.reject(error);

    // Token hết hạn
    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosClient(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axiosClient.post("/auth/refresh-token");
        processQueue(null, true);

        return axiosClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
