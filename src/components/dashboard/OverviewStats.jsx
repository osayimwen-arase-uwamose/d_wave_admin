import OverviewStatCard from "./OverviewStatCard.jsx";

import { 
  DASHBOARD_OVERVIEW_STATS
} from "../../data/dashboardOverview.js";

function OverviewStats({
  events = [],
  loading = false,
  error = null,
}) {
  const stats = {
    activeEvents: error
      ? null
      : events.length,

    subscribers: null,

    unreadInquiries: null,

    activeCrew: null,
  };

  return (
    <section
      className="dw-admin-overview-stats"
      aria-label="Dashboard statistics"
    >
      {DASHBOARD_OVERVIEW_STATS.map((stat) => {
        const isActiveEvents =
          stat.valueKey === "activeEvents";

        const value = loading
          ? null
          : stats[stat.valueKey];

        const footerLabel =
          loading && isActiveEvents
            ? "LOADING EVENTS"
            : error && isActiveEvents
              ? "DATA UNAVAILABLE"
              : stat.footerLabel;

        const footerType =
          error && isActiveEvents
            ? "unavailable"
            : stat.footerType;

        return (
          <OverviewStatCard
            key={stat.id}
            title={stat.title}
            description={stat.description}
            icon={stat.icon}
            value={value}
            footerLabel={footerLabel}
            footerType={footerType}
          />
        );
      })}
    </section>
  );
}

export default OverviewStats;
