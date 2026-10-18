import axiosClient from "./axiosClient.js";
import axiosPrivate from "./axiosPrivate.js";

import ENDPOINTS from "../data/endpoints.js";


const login = async (credentials) => {
  const response =
    await axiosClient.post(
      ENDPOINTS.AUTH.LOGIN,
      credentials
    );

  return response.data;
};

const logout = async () => {
  const response =
    await axiosPrivate.post(
      ENDPOINTS.AUTH.LOGOUT
    );

  return response.data;
};


const refresh = async () => {
  const response =
    await axiosPrivate.post(
      ENDPOINTS.AUTH.REFRESH
    );

  return response.data;
};


const getProfile = async () => {
  const response =
    await axiosPrivate.get(
      ENDPOINTS.AUTH.PROFILE
    );

  return response.data;
};

export {
  login,
  logout,
  refresh,
  getProfile,
};
