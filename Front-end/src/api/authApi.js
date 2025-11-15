import axiosClient from "./axiosClient";

const authApi = {
  login: (data) => axiosClient.post("/auth/login", data),
  register: (data) => axiosClient.post("/auth/register", data),
  refresh: () => axiosClient.post("/auth/refresh"),
  logout: () => axiosClient.post("/auth/logout"),
  getUserById: (userId) => axiosClient.get(`/users/${userId}`),
  refresh: () => axiosClient.post("/auth/refresh-token"),
  getProfile: () => axiosClient.get("/auth/profile"),
  loginWithGoogle: (googleToken) =>
    axiosClient.post("/auth/google", { googleToken }),
};

export default authApi;
