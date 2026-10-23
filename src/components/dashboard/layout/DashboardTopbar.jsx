import {
  Bell,
  Settings,
  Menu,
} from "lucide-react";

import { toast } from "sonner";

const DashboardTopbar = ({
  onMenuClick,
  isSidebarOpen = false,
}) => {
  return (
    <header className="dashboard-topbar">
      <div className="dashboard-topbar-leading">
        <button
          type="button"
          className="dashboard-mobile-menu-button"
          onClick={onMenuClick}
          aria-label={isSidebarOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isSidebarOpen}
          aria-controls="dashboard-sidebar"
        >
          <Menu size={22} aria-hidden="true" />
        </button>
      </div>

      <div className="dashboard-topbar-actions">
        <button
          type="button"
          className="dashboard-icon-button"
          aria-label="Notifications"
          onClick={() => toast.info("You're all caught up")}
        >
          <Bell size={20} aria-hidden="true" />

          <span className="notification-badge">
            0
          </span>
        </button>

        {/* <button
          type="button"
          className="dashboard-icon-button"
          aria-label="Settings"
        >
          <Settings size={20} aria-hidden="true" />
        </button> */}
      </div>
    </header>
  );
};

export default DashboardTopbar;
