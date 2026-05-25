import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "pendakian/cicd/my/id/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 Request interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (
      token &&
      !config.url.includes("/login") &&
      !config.url.includes("/register")
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      console.log("Unauthorized, redirect login");
    }

    return Promise.reject(error);
  }
);

export default API;