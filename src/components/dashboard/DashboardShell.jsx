import { useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardSidebar from "./DashboardSidebar.jsx";
import DashboardTopbar from "./DashboardTopbar.jsx";
import DashboardHeader from "./DashboardHeader.jsx";

import useEvents from "../../hooks/useEvents.js";

import useAuth from "../../hooks/useAuth.js";


function DashboardShell({ 
  headerData,
  workspace,
  selected
}) {
  const [view, setView] = useState("grid");

  const navigate = useNavigate();

  const { 
    user,
    isInitializing,
  } = useAuth();

  const { 
    events,
    loading,
    error,
    refetch,
  } = useEvents();

  const handleCreateEvent = () => {
    navigate("/dashboard/create-event");
  };

  if (isInitializing) { 
    return <div>Initializing...</div>
  }

  return (
    <div className="dashboard-shell">

      <DashboardSidebar
        onCreateHub={handleCreateEvent}
        selected={selected}
      />

      <main className="dashboard-main">

        <DashboardTopbar />

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
};

export default DashboardShell;
