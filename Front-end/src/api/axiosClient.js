import axios from "axios";

/**
 * ================================
 * BASE URL logic cho Local + Docker
 * ================================
 */

// 1) Khi chạy LOCAL (npm run dev)
// → import.meta.env.VITE_API_URL có giá trị → dùng local backend
let API_URL = import.meta.env.VITE_API_URL || "/api/v1";

// 2) Khi chạy DOCKER → không có VITE_API_URL
// → FE phải gọi BE qua service name "backend"
if (!API_URL) {
  API_URL = "http://backend:5000/api/v1";
}

console.log("🔗 FE đang dùng API:", API_URL);

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Tự động gửi cookie
  timeout: 10000,
});

// ========= REQUEST =========
axiosClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// ========= RESPONSE (Refresh Token Logic) =========
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

    if (originalRequest.url === "/auth/refresh-token") {
      return Promise.reject(error);
    }

    const hasRefresh = document.cookie.includes("refreshToken=");

    if (!hasRefresh) {
      return Promise.reject(error);
    }

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
