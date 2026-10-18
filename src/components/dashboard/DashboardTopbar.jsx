import { 
  Bell,
  Settings,
} from "lucide-react";

const DashboardTopbar = () => { 
  return (
    <header className="dashboard-topbar">

      <div className="dashboard-mobile-logo">
        D-WAVE
      </div>

      <div className="dashboard-topbar-actions">
        <button
          type="button"
          className="dashboard-icon-button"
          aria-label="Notifications"
        >
          <Bell size={20} />

          <span className="notification-badge">
            0
          </span>
        </button>

        <button
          type="button"
          className="dashboard-icon-button"
          aria-label="Settings"
        >
          <Settings size={20} />
        </button>
      </div>

    </header>
  );
};

export default DashboardTopbar;
