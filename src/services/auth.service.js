import {
  login as loginRequest,
  logout as logoutRequest,
  refresh as refreshRequest,
  getProfile as getProfileRequest,
} from "../api/auth.api.js";

import tokenService from "./token.service.js";

const authService = {
  async login(credentials) {
    const response =
      await loginRequest(credentials);

    const {
      accessToken,
      user,
    } = response.data;

    if (!accessToken) {
      throw new Error(
        "Authentication response did not contain an access token."
      );
    };

    tokenService.setAccessToken(
      accessToken
    );

    return {
      accessToken,
      user,
    };
  },

  async logout() {
    try {
      await logoutRequest();
    } finally {
      tokenService.removeAccessToken();
    }
  },

  async refresh() {
    const response =
      await refreshRequest();

    const {
      accessToken,
    } = response.data;

    if (!accessToken) {
      throw new Error(
        "Refresh response did not contain an access token."
      );
    };

    tokenService.setAccessToken(
      accessToken
    );

    return {
      accessToken,
    };
  },

  async me() {
    const response =
      await getProfileRequest();

    return response.data.user;
  },
};

export default authService;
