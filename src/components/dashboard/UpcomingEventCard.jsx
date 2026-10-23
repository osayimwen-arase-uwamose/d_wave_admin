import {
  CalendarDays,
  MapPin,
  Clock3,
} from "lucide-react";

function formatEventDate(value) {
  if (!value) {
    return "Date not specified";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date not specified";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatEventTime(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getEventTitle(event) {
  return (
    event?.title
  );
}

function getEventLocation(event) {
  return (
    event?.venue 
  );
}

function getEventCategory(event) {
  const status = event?.category;

  return String(status)
    .replaceAll("_", " ")
    .replaceAll("-", " ");
};

function UpcomingEventCard({
  event,
  onViewEvent,
}) {
  const eventId = event?._id ?? event?.id;

  const eventDate = event.scheduledAt

  const location = getEventLocation(event);

  const time = formatEventTime(eventDate);

  const title = getEventTitle(event);

  return (
    <article className="dw-admin-event-card">
      <div className="dw-admin-event-card__main">
        <div className="dw-admin-event-card__date">
          <CalendarDays
            size={15}
            aria-hidden="true"
          />

          <span>{formatEventDate(eventDate)}</span>
        </div>

        <h3 className="dw-admin-event-card__title">
          {title}
        </h3>

        <div className="dw-admin-event-card__meta">
          {time ? (
            <span className="dw-admin-event-card__meta-item">
              <Clock3
                size={14}
                aria-hidden="true"
              />

              {time}
            </span>
          ) : null}

          {location ? (
            <span className="dw-admin-event-card__meta-item">
              <MapPin
                size={14}
                aria-hidden="true"
              />

              <span>{location}</span>
            </span>
          ) : null}
        </div>
      </div>

      <div className="dw-admin-event-card__aside">
        <span className="dw-admin-status">
          {getEventCategory(event)}
        </span>

        {eventId && onViewEvent ? (
          <button
            type="button"
            className="dw-admin-text-button"
            onClick={() => onViewEvent(event)}
            aria-label={`View ${title}`}
          >
            View event
          </button>
        ) : null}
      </div>
    </article>
  );
}

export default UpcomingEventCard;
