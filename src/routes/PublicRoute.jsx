import { Navigate, Outlet } from "react-router-dom";

import useAuth from "../hooks/useAuth.js";

const PublicRoute = () => {
  const {
    accessToken,
    isInitializing,
  } = useAuth();

  if (isInitializing) {
    return (
      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-background
        "
      >
        <p className="text-text-muted">
          Initializing session...
        </p>
      </div>
    );
  }

  if (accessToken) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return <Outlet />;
};

export default PublicRoute;
