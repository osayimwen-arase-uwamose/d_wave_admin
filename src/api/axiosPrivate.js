import axios from "axios";

import tokenService from "../services/token.service.js";

const axiosPrivate = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,

  withCredentials: true,

  timeout: 15000,
});

axiosPrivate.interceptors.request.use(
  (config) => {
    const accessToken =
      tokenService.getAccessToken();

    if (accessToken) {
      config.headers.Authorization =
        `Bearer ${accessToken}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

export default axiosPrivate;
