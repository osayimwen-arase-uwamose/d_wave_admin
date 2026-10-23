import { useMemo } from "react";

import {
  CalendarDays,
  ArrowRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import UpcomingEventCard from "./UpcomingEventCard.jsx";
import DashboardEmptyState from "./DashboardEmptyState.jsx";

function getEventDate(event) {
  return (
    event?.scheduledAt
  );
}

function getEventTimestamp(event) {
  const value = getEventDate(event);

  if (!value) {
    return null;
  }

  const timestamp = new Date(value).getTime();

  return Number.isNaN(timestamp)
    ? null
    : timestamp;
}

function UpcomingEvents({
  events = [],
  loading = false,
  error = null,
  onRetry,
  onViewEvent,
}) {
  const navigate = useNavigate();

  const upcomingEvents = useMemo(() => {
    const now = Date.now();

    return events
      .filter((event) => {
        const timestamp = getEventTimestamp(event);

        return timestamp === null || timestamp >= now;
      })
      .sort((first, second) => {
        const firstDate = getEventTimestamp(first);
        const secondDate = getEventTimestamp(second);

        if (firstDate === null && secondDate === null) {
          return 0;
        }

        if (firstDate === null) {
          return 1;
        }

        if (secondDate === null) {
          return -1;
        }

        return firstDate - secondDate;
      })
      .slice(0, 3);
  }, [events]);

  return (
    <section className="dw-admin-section">
      <div className="dw-admin-section__header">
        <div>
          <div className="dw-admin-section__title-row">
            <h2 className="dw-admin-section__title">
              Upcoming Events
            </h2>

            {!loading && !error ? (
              <span className="dw-admin-count-badge">
                {upcomingEvents.length}
              </span>
            ) : null}
          </div>

          <p className="dw-admin-section__description">
            Keep track of your next scheduled experiences.
          </p>
        </div>

        <button
          type="button"
          className="dw-admin-text-button dw-admin-text-button--icon"
          onClick={() => navigate("/dashboard/events")}
        >
          View all

          <ArrowRight
            size={15}
            aria-hidden="true"
          />
        </button>
      </div>

      {loading ? (
        <div className="dw-admin-loading-state" role="status">
          Loading upcoming events…
        </div>
      ) : error ? (
        <DashboardEmptyState
          icon={CalendarDays}
          title="Events could not be loaded"
          description="We couldn't retrieve the current event list. Try again in a moment."
          action={
            <button
              type="button"
              className="dw-admin-button dw-admin-button--secondary"
              onClick={onRetry}
            >
              Try again
            </button>
          }
        />
      ) : upcomingEvents.length === 0 ? (
        <DashboardEmptyState
          icon={CalendarDays}
          title="No upcoming events"
          description="Upcoming events will appear here when they are available."
          action={
            <button
              type="button"
              className="dw-admin-button dw-admin-button--primary"
              onClick={() => navigate("/dashboard/create-event")}
            >
              Create an event
            </button>
          }
        />
      ) : (
        <div className="dw-admin-event-list">
          {upcomingEvents.map((event, index) => (
            <UpcomingEventCard
              key={event?._id ?? event?.id ?? `event-${index}`}
              event={event}
              onViewEvent={onViewEvent}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default UpcomingEvents;
