import axios from "axios";

// 🔗 API_URL từ .env
const API_URL = import.meta.env.VITE_API_URL;

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // Gửi cookie HttpOnly (access + refresh)
  timeout: 10000,
});

// ===========================
//   REQUEST INTERCEPTOR
// ===========================
axiosClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// ===========================
//   REFRESH TOKEN LOGIC
// ===========================

// Trạng thái refresh
let isRefreshing = false;

// Hàng đợi request khi refresh đang xử lý
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) promise.reject(error);
    else promise.resolve(token);
  });
  failedQueue = [];
};

// ===========================
//   RESPONSE INTERCEPTOR
// ===========================
axiosClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!error.response) return Promise.reject(error);

    // Nếu API refresh-token lỗi → không retry nữa
    if (originalRequest.url.includes("/auth/refresh-token")) {
      return Promise.reject(error);
    }

    // Nếu nhận 401 và request chưa retry refresh
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Nếu đã có refresh đang chạy → đợi vào queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosClient(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      // Thực hiện refresh token
      isRefreshing = true;

      try {
        // Gọi API refresh-token, cookie gửi tự động
        await axiosClient.post("/auth/refresh-token");

        // Xử lý queue
        processQueue(null, true);

        // Gửi lại request cũ
        return axiosClient(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);

        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    // Trường hợp lỗi khác → trả luôn
    return Promise.reject(error);
  }
);

export default axiosClient;
