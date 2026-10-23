import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import DashboardSidebar from "./DashboardSidebar.jsx";
import DashboardTopbar from "./DashboardTopbar.jsx";
import DashboardHeader from "./DashboardHeader.jsx";

import useAuth from "../../../hooks/useAuth.js";

function DashboardShell({
  headerData,
  workspace,
  selected,
}) {
  const [view, setView] = useState("grid");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const {
    isInitializing,
  } = useAuth();

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((current) => !current);
  }, []);

  const handleCreateEvent = useCallback(() => {
    closeSidebar();
    navigate("/dashboard/create-event");
  }, [closeSidebar, navigate]);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    closeSidebar();
  }, [navigate, closeSidebar]);

  // Prevent the page behind the mobile drawer from scrolling.
  useEffect(() => {
    if (!isSidebarOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;

      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSidebarOpen, closeSidebar]);

  // A desktop sidebar should not remain in its mobile drawer state
  // if the viewport is resized from mobile to desktop.
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const handleViewportChange = (event) => {
      if (event.matches) {
        closeSidebar();
      }
    };

    mediaQuery.addEventListener("change", handleViewportChange);

    return () => {
      mediaQuery.removeEventListener("change", handleViewportChange);
    };
  }, [closeSidebar]);

  if (isInitializing) {
    return (
      <div className="dashboard-initializing">
        Initializing...
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      {/* Mobile backdrop */}
      <button
        type="button"
        className={
          isSidebarOpen
            ? "dashboard-sidebar-backdrop dashboard-sidebar-backdrop-open"
            : "dashboard-sidebar-backdrop"
        }
        onClick={closeSidebar}
        aria-label="Close navigation menu"
        tabIndex={isSidebarOpen ? 0 : -1}
        aria-hidden={!isSidebarOpen}
      />

      {/* Shared desktop sidebar and mobile drawer */}
      <DashboardSidebar
        onCreateHub={handleCreateEvent}
        selected={selected}
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />

      <main className="dashboard-main">
        <DashboardTopbar
          onMenuClick={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />

        <div className="dashboard-content">
          <div className="dashboard-container">
            <DashboardHeader
              view={view}
              onViewChange={setView}
              data={headerData}
            />

            {workspace}
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardShell;
