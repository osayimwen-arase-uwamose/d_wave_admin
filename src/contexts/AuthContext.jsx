import {
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import tokenService from "../services/token.service.js";

import authService from "../services/auth.service.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [
    user,
    setUser,
  ] = useState(null);

  const [
    accessToken,
    setAccessTokenState,
  ] = useState(
    tokenService.getAccessToken()
  );

  const [
    isInitializing,
    setIsInitializing,
  ] = useState(true);

  const login = ({
    user,
    accessToken,
  }) => {
    tokenService.setAccessToken(
      accessToken
    );

    setAccessTokenState(
      accessToken
    );

    setUser(user);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      tokenService.removeAccessToken();

      setAccessTokenState(null);
      setUser(null);
    };
  };

  const refresh = async () => {
    const response = await authService.refresh();

    const { 
      accessToken,
    } = response;

    setAccessTokenState(accessToken);

    return accessToken;
  };

  const setAccessToken = (token) => {
    tokenService.setAccessToken(
      token
    );

    setAccessTokenState(token);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const existingToken =
          tokenService.getAccessToken();

        if (existingToken) {
          const currentUser =
            await authService.me();

          setUser(currentUser);

          return;
        }

        const newAccessToken =
          await refresh();

        if (!newAccessToken) {
          return;
        }

        const currentUser =
          await authService.me();

        setUser(currentUser);

      } catch (error) {
        console.error(
          "Auth initialization failed:",
          error
        );

        tokenService.removeAccessToken();

        setAccessTokenState(null);
        setUser(null);

      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, []);

  const value = useMemo(
    () => ({
      user,
      accessToken,
      isInitializing,

      login,
      logout,
      refresh,

      setAccessToken,
      setUser,
    }),
    [
      user,
      accessToken,
      isInitializing,
    ]
  );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
