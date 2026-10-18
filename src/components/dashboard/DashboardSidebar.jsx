import { useState, useEffect } from "react";

import { Link } from "react-router-dom";

import useAuth from "../../hooks/useAuth.js";

import DashboardNavItem from "./DashboardNavItem.jsx";
import Button from "../ui/Button.jsx";

import { 
  Bell,
  CircleHelp,
  LayoutDashboard,
  LogOut,
  Plus,
} from "lucide-react";

const DashboardSidebar = ({ 
  onCreateHub,
  selected
}) => { 
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className="dashboard-sidebar">

      <div className="dashboard-sidebar-header">
        <div className="w-full flex items-center justify-center">
          <img src="https://res.cloudinary.com/gbpvhers/image/upload/v1791226266/logo.jpg" alt="d-wave_entertainment_logo" className="w-8 h-8" />
        </div>


        <br />

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
          active={selected==="dashboard"}
        />

        <DashboardNavItem
          to="/dashboard/events"
          icon={Bell}
          label="Events"
          active={selected==="events"}
        />
      </nav>

      <div className="dashboard-sidebar-section">

        <button
          type="button"
          onClick={handleLogout}
          className="dashboard-logout"
          size="sm"
        >
          <LogOut size={18} />

          <span>
            Log Out
          </span>
        </button>

      </div>

      <div className="dashboard-sidebar-section">

        <Link
          to="/help"
          className="dashboard-help"
        >
          <CircleHelp size={18} />

          <span>
            Help Support
          </span>
        </Link>

      </div>

    </aside>
  );
};

export default DashboardSidebar;
