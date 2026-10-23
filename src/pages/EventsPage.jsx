import DASHBOARD_HEADERS from "../data/dashboardHeaders.js";
import EventsGrid from "../components/dashboard/events/EventsGrid.jsx";

import DashboardShell from "../components/dashboard/layout/DashboardShell.jsx";

import useEvents from "../hooks/useEvents.js";
import useAuth from "../hooks/useAuth.js";
import { Link, useNavigate } from "react-router-dom";


function EventsPage () { 
  const navigate = useNavigate();

  const { 
    user
  } = useAuth();

  const { 
    events,
    loading,
    error,
    refetch,
  } = useEvents();

  const handleViewEvent = async (event) => {

    const eventId = event?._id ?? event?.id;
    const userId = user?._id ?? user?.id;

    if (!eventId) {
      console.error(
        "Cannot view Event: missing event ID.",
        event
      );

      return;
    }

    if (!userId) {
      console.error(
        "Cannot view event: missing authenticated user ID.",
        user
      );

      return;
    }

    navigate(`/events/${eventId}`);
    return;
  };

  const handleCreateEvent = () => {
    navigate("/dashboard/create-event");
  };

  const Workspace = () => { 
    return ( 
      <EventsGrid 
        events={events}
        loading={loading}
        error={error}
        onRetry={refetch}
        onViewEvent={handleViewEvent}
        onCreateEvent={handleCreateEvent}
        // view={view}
      />
    )
  };

  const DashboardPath = () => { 
    return ( 
      <div className="flex gap-2">
        <Link to={'dashboard/events'}>
        EVENTS
        </Link>
      </div>
    )
  }

  return (
    <DashboardShell 
      headerData={{
        ...DASHBOARD_HEADERS.EVENTS,
        path: <DashboardPath />, 
      }} 
      workspace={<Workspace />}
      selected="events"
    />
  )
};

export default EventsPage;
