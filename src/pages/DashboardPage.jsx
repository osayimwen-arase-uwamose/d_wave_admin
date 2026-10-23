import { useNavigate, Link } from "react-router-dom";

import DashboardShell from "../components/dashboard/layout/DashboardShell.jsx";
import DashboardOverview from "../components/dashboard/DashboardOverview.jsx";

import useEvents from "../hooks/useEvents.js";
import useAuth from "../hooks/useAuth.js";

function DashboardPage() {
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

  const handleViewEvent = (event) => {
    const eventId = event?._id ?? event?.id;

    if (!eventId) {
      console.error(
        "Cannot view event: missing event ID.",
        event
      );

      return;
    }

    navigate(`/events/${eventId}`);
  };

  const handleRetry = () => {
    if (typeof refetch === "function") {
      refetch();
    }
  };

  const DashboardPath = () => { 
    return ( 
      <div className="flex gap-2"> 
        <Link to={"/dashboard"}>
          DASHBOARD
        </Link>
      </div>
    );
  };

  const safeEvents = Array.isArray(events)
    ? events
    : [];

  if (isInitializing) {
    return (
      <div className="dw-admin-initializing" role="status">
        Initializing dashboard…
      </div>
    );
  }

  return (
    <DashboardShell
      headerData={{
        title: "Dashboard",
        subtitle:
          "Your overview of events, audience engagement, inquiries, and operations.",
        path: <DashboardPath />,
      }}
      selected="dashboard"
      workspace={
        <DashboardOverview
          events={safeEvents}
          loading={loading}
          error={error}
          onRetry={handleRetry}
          onViewEvent={handleViewEvent}
        />
      }
    />
  );
}

export default DashboardPage;
