import OverviewStats from "./OverviewStats.jsx";
import UpcomingEvents from "./UpcomingEvents.jsx";
import DashboardNotifications from "./DashboardNotifications.jsx";

function DashboardOverview({
  events = [],
  loading = false,
  error = null,
  onRetry,
  onViewEvent,
}) {
  return (
    <div className="dw-admin-overview">
      <OverviewStats
        events={events}
        loading={loading}
        error={error}
      />

      <div className="dw-admin-overview__content">
        <UpcomingEvents
          events={events}
          loading={loading}
          error={error}
          onRetry={onRetry}
          onViewEvent={onViewEvent}
        />

        <DashboardNotifications />
      </div>
    </div>
  );
}

export default DashboardOverview;
