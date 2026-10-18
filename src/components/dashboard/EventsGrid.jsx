import EventCard from "./EventCard.jsx";
import CreateEventCard from "./CreateEventCard.jsx";

function EventsGridLoading() {
  return (
    <div className="hub-grid">
      {[1, 2, 3, 4].map(
        (item) => (
          <div
            key={item}
            className="hub-card animate-pulse"
          >
            <div className="p-5">
              <div className="h-10 w-10 bg-surface-container" />
            </div>

            <div className="p-5">
              <div className="mb-3 h-6 w-3/4 bg-surface-container" />

              <div className="h-4 w-full bg-surface-container" />

              <div className="mt-2 h-4 w-2/3 bg-surface-container" />
            </div>
          </div>
        )
      )}
    </div>
  );
}

function EventsGridError({
  onRetry,
}) {
  return (
    <div className="card p-8 text-center">

      <h2 className="heading-sm">
        Unable to load your events
      </h2>

      <p className="body-md mt-2 text-text-muted">
        Something went wrong while
        retrieving your events.
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="neo-button mt-6 bg-primary px-6 py-3 text-white"
      >
        Try Again
      </button>

    </div>
  );
}

function EventsGridEmpty({
  onCreateEvent,
}) {
  return (
    <div className="card p-12 text-center">

      <h2 className="heading-sm">
        No Events Yet
      </h2>

      <p className="body-md mx-auto mt-2 max-w-md text-text-muted">
        You haven't created any event yet.
      </p>

      <button
        type="button"
        onClick={onCreateEvent}
        className="neo-button mt-6 bg-primary px-6 py-3 text-white"
      >
        Create Your First Event
      </button>

    </div>
  );
}

const EventsGrid = ({
  events,
  loading,
  error,
  onRetry,
  onViewEvent,
  onCreateEvent,
  view,
}) => {
  if (loading) {
    return (
      <EventsGridLoading />
    );
  }

  if (error) {
    return (
      <EventsGridError
        onRetry={onRetry}
      />
    );
  }

  if (!events?.length) {
    return (
      <EventsGridEmpty
        onCreateEvent={onCreateEvent}
      />
    );
  }

  return (
    <div
      className={
        view === "list"
          ? "hub-grid hub-grid-list"
          : "hub-grid"
      }
    >

      {events.map((event) => (
        <EventCard 
          key={event.id || event._id}
          event={event}
          onOpen={onViewEvent}
        />
      ))}

      <CreateEventCard 
        onClick={onCreateEvent}
      />

    </div>
  );
};

export default EventsGrid;
