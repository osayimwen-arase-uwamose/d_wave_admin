import {
  refresh as refreshRequest,
} from "../api/auth.api.js";

import useAuth from "./useAuth.js";


const useRefreshToken = () => {
  const {
    setAccessToken,
  } = useAuth();

  return async () => {
    const response =
      await refreshRequest();

    const newAccessToken =
      response.data.data.accessToken;

    if (!newAccessToken) {
      throw new Error(
        "Refresh response did not contain an access token."
      );
    }

    setAccessToken(
      newAccessToken
    );

    return newAccessToken;
  };
};

export default useRefreshToken;
