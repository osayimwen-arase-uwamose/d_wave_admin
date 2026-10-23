import {
  useEffect,
  useRef,
} from "react";

import { Link, useLocation } from "react-router-dom";

import { toast } from "sonner";

import {
  Bell,
  CircleHelp,
  LayoutDashboard,
  LogOut,
  Plus,
  X,
} from "lucide-react";

import useAuth from "../../../hooks/useAuth.js";

import DashboardNavItem from "./DashboardNavItem.jsx";
import Button from "../../ui/Button.jsx";

const DashboardSidebar = ({
  onCreateHub,
  selected,
  isOpen = false,
  onClose = () => {},
}) => {
  const { logout } = useAuth();
  const location = useLocation();
  const closeButtonRef = useRef(null);

  const handleLogout = () => {
    onClose();
    logout();
  };

  // Close the mobile drawer after navigation.
  useEffect(() => {
    onClose();
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Move focus into the drawer when it opens.
  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <aside
      id="dashboard-sidebar"
      className={
        isOpen
          ? "dashboard-sidebar dashboard-sidebar-mobile-open"
          : "dashboard-sidebar"
      }
      aria-label="Dashboard navigation"
      aria-hidden={!isOpen && window.innerWidth < 768}
      inert={!isOpen && window.innerWidth < 768}
    >
      <div className="dashboard-sidebar-header">
        <div className="dashboard-sidebar-heading">
          <div className="dashboard-sidebar-logo-wrapper">
            <img
              src="https://res.cloudinary.com/gbpvhers/image/upload/v1791226266/logo.jpg"
              alt="D-Wave Entertainment"
              className="dashboard-sidebar-logo-image"
            />
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            className="dashboard-sidebar-close-button"
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            <X size={22} aria-hidden="true" />
          </button>
        </div>

        <Button
          type="button"
          variant="primary"
          size="sm"
          icon={Plus}
          className="w-full"
          onClick={onCreateHub}
        >
          Create New Event
        </Button>
      </div>

      <nav className="dashboard-sidebar-nav">
        <DashboardNavItem
          to="/dashboard"
          icon={LayoutDashboard}
          label="Dashboard"
          active={selected === "dashboard"}
        />

        <DashboardNavItem
          to="/dashboard/events"
          icon={Bell}
          label="Events"
          active={selected === "events"}
        />
      </nav>

      <div className="dashboard-sidebar-section">
        <button
          type="button"
          onClick={handleLogout}
          className="dashboard-logout"
        >
          <LogOut size={18} aria-hidden="true" />
          <span>Log Out</span>
        </button>
      </div>

      <div className="dashboard-sidebar-section">
        <Link
          to="#"
          className="dashboard-help"
          onClick={() => toast.info("Contact support via email: support@dwaveentertainment.co.uk")}
        >
          <CircleHelp size={18} aria-hidden="true" />
          <span>Help Support</span>
        </Link>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
