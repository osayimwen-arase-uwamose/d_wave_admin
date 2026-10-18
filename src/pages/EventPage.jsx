import {
  AlertCircle,
  LoaderCircle,
  ImageOff,
  Trash2,
  X,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
  Link,
} from "react-router-dom";

import { toast } from "sonner";

import useEvents from "../hooks/useEvents.js";

import DashboardShell from "../components/dashboard/DashboardShell.jsx";

import EventHero from "../components/dashboard/event/EventHero.jsx";
import EventMeta from "../components/dashboard/event/EventMeta.jsx";
import EventTabs from "../components/dashboard/event/EventTabs.jsx";
import EventOverview from "../components/dashboard/event/EventOverview.jsx";
import EventGallery from "../components/dashboard/event/EventGallery.jsx";
import EventActions from "../components/dashboard/event/EventActions.jsx";

const EventPage = () => {
const { eventId } = useParams();
const navigate = useNavigate();

const [event, setEvent] =
useState(null);
const [eventToDelete, setEventToDelete] = useState(null);
const [deletingEventId, setDeletingEventId] = useState(null);
const [deleteEventError, setDeleteEventError] = useState(null);

const {
getEvent,
getting,
getError,
deleteEvent,
deleting,
deleteError,
} = useEvents();

const loadEvent = useCallback(
async () => {
if (!eventId) {
return;
}

  try {
    const eventData =
      await getEvent(eventId);

    setEvent(eventData);
  } catch (error) {
    console.error(
      "Failed to load Event:",
      error,
    );
  }
},
[eventId, getEvent],
);

useEffect(() => {
loadEvent();
}, [loadEvent]);

if (getting) {
return ( <div
     className="
       flex
       min-h-screen
       items-center
       justify-center
       bg-background
     "
   > <div
       className="
         flex
         items-center
         gap-3
       "
     > <LoaderCircle
         size={22}
         className="
           animate-spin
           text-primary
         "
       />

      <span
        className="
          font-mono
          text-xs
          font-bold
          uppercase
          tracking-[0.1em]
          text-text-muted
        "
      >
        Loading Event...
      </span>
    </div>
  </div>
);
}

if (getError) {
return ( <div
     className="
       flex
       min-h-screen
       items-center
       justify-center
       bg-background
       p-6
     "
   > <div
       className="
         w-full
         max-w-md
         rounded-xl
         border
         border-slate-200
         bg-white
         p-6
         shadow-sm
       "
     > <AlertCircle
         size={28}
         className="
           mb-4
           text-[#DC2626]
         "
       />

      <h1
        className="
          font-display
          text-xl
          font-bold
          tracking-tight
          text-primary
        "
      >
        Unable to Load Event
      </h1>

      <p
        className="
          mt-2
          font-body
          text-sm
          leading-6
          text-text-muted
        "
      >
        The event could not be
        loaded. Please try again.
      </p>

      <button
        type="button"
        onClick={loadEvent}
        className="
          mt-5
          rounded-lg
          bg-primary
          px-4
          py-2.5
          font-display
          text-sm
          font-semibold
          text-white
          shadow-sm
          transition
          hover:bg-brand-hover
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-primary
          focus-visible:ring-offset-2
        "
      >
        Try Again
      </button>
    </div>
  </div>
);
}

if (!event) {
 return null;
}

const DashboardPath = () => { 
  return ( 
    <div className="flex gap-2"> 
      <Link to={"/dashboard/events"}>
      EVENTS
      </Link>

      <span>/</span>

      <Link to={`/events/${eventId}`}>
      {event.title}
      </Link>
    </div>
  )
}

const handleDeleteEvent = async () => {
  if (
    !event?._id ||
    !eventToDelete?._id
  ) {
    setDeleteEventError(
      "The event could not be identified."
    );

    return;
  };

  const eventToDeleteId = eventToDelete._id || event._id;

  setDeleteEventError(null)
  // setDeleteErrorId(null);
  setDeletingEventId(eventToDeleteId);

  try { 
    await deleteEvent(eventToDeleteId);

    setEventToDelete(null);

    toast.success(
      `"${event.title}" deleted successfully.`
    )

    navigate('/dashboard/events')
  } catch (error) { 
    console.error(
      "Failed to delete event:", error,
    );

     toast.error(
      error?.response?.data?.message ??
        "Unable to delete event.",
    );
  } finally { 
    setEventToDelete(null);
  };
};

return (
  <>
    <DashboardShell
      headerData={{ 
        title: "",
        subtitle: "",
        path: <DashboardPath />
      }}

      workspace={ <main
            className="
              w-full
              bg-background
            "
          > <div
            className="
              mx-auto
              w-full
              max-w-5xl
              px-4
              py-5
              sm:px-6
              sm:py-6
              lg:px-8
            "
          > <EventHero
              event={event}
            />

            <EventMeta
              event={event}
            />

            <EventTabs
              galleryCount={
                event.galleryPhotos.length
              }
              overview={
                <EventOverview
                  event={event}
                />
              }
              gallery={
                <EventGallery
                  event={event}
                  onRefresh={loadEvent}
                />
              }
            />

            <EventActions
              onUpdate={() => {
                navigate(
                  `/dashboard/events/${eventId}/edit`,
                );
              }}

              onDelete={() => {
                setEventToDelete(event);
              }}

              onAddImage={() => {
              navigate(
                `/dashboard/events/${eventId}/gallery/add`,
              )
              }}
            />

            {eventToDelete && (
              <div
                className="
                  fixed
                  inset-0
                  z-50
                  flex
                  items-center
                  justify-center
                  overflow-y-auto
                  bg-primary/50
                  p-4
                  backdrop-blur-[2px]
                "
                onMouseDown={(mouseEvent) => {
                  if (
                    mouseEvent.target ===
                      mouseEvent.currentTarget &&
                    deletingEventId === null
                  ) {
                    setEventToDelete(null);
                    setDeleteEventError(null);
                  }
                }}
              >
                <section
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="delete-event-title"
                  aria-describedby="delete-event-description"
                  className="
                    relative
                    w-full
                    max-w-md
                    border
                    border-grid-line
                    bg-surface
                    p-5
                    shadow-neo
                    sm:p-6
                  "
                >
                  {/* Dialog header */}
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEventToDelete(null);
                        setDeleteEventError(null);
                      }}
                      disabled={
                        deletingEventId !== null
                      }
                      aria-label="Close confirmation"
                      className="
                        rounded-lg
                        p-2
                        text-text-muted
                        transition-colors
                        hover:bg-surface-container
                        hover:text-primary
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-primary
                        disabled:opacity-50
                      "
                    >
                      <X
                        size={18}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
      
                  {/* Dialog content */}
                  <div className="mb-5 flex flex-col items-center">
                    <div
                      className="
                        mb-4
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-lg
                        border
                        border-grid-line
                        bg-surface-container
                        text-primary
                      "
                    >
                      <Trash2
                        size={22}
                        aria-hidden="true"
                      />
                    </div>
      
                    <h2
                      id="delete-event-title"
                      className="
                        font-display
                        text-lg
                        font-bold
                        tracking-tight
                        text-primary
                      "
                    >
                      Delete this event?
                    </h2>
      
                    <p
                      id="delete-event-description"
                      className="
                        mt-2
                        font-body
                        text-sm
                        leading-6
                        text-text-muted
                        text-center
                      "
                    >
                      This will delete{" "}
                      <span className="font-semibold text-text">
                        {eventToDelete.title}
                      </span>{" "} permanently.
                      This action cannot be undone.
                    </p>
                  </div>
      
                  {/* Photo context */}
                  <div
                    className="
                      mb-5
                      flex
                      items-center
                      gap-3
                      border
                      border-grid-line
                      bg-surface-container-low
                      p-3
                    "
                  >
                    {eventToDelete.flyerUrl ? (
                      <img
                        src={
                          eventToDelete.flyerUrl
                        }
                        alt=""
                        className="
                          h-14
                          w-20
                          shrink-0
                          object-cover
                        "
                      />
                    ) : (
                      <div
                        className="
                          flex
                          h-14
                          w-20
                          shrink-0
                          items-center
                          justify-center
                          bg-surface-container
                        "
                      >
                        <ImageOff
                          size={20}
                          aria-hidden="true"
                        />
                      </div>
                    )}
      
                    <div className="min-w-0">
                      <p
                        className="
                          font-body
                          text-xs
                          font-semibold
                          text-primary
                        "
                      >
                        {eventToDelete.title}
                      </p>
      
                      <p
                        className="
                          mt-1
                          truncate
                          font-mono
                          text-[9px]
                          text-text-muted
                        "
                      >
                        {eventToDelete.category}
                      </p>
      
                    </div>
                  </div>
      
                  {deleteEventError !== null && (
                      <div
                        role="alert"
                        className="
                          mb-4
                          flex
                          items-start
                          gap-2
                          border
                          border-red-200
                          bg-red-50
                          p-3
                          font-body
                          text-xs
                          leading-5
                          text-status-red
                        "
                      >
                        <AlertCircle
                          size={16}
                          className="mt-0.5 shrink-0"
                          aria-hidden="true"
                        />
      
                        {deleteEventError}
                      </div>
                    )}
      
                  {/* Actions */}
                  <div className="flex flex-col gap-2.5">
                    <button
                      type="button"
                      onClick={handleDeleteEvent}
                      disabled={
                        deletingEventId !== null
                      }
                      className="
                        inline-flex
                        min-h-11
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        bg-primary
                        px-4
                        font-display
                        text-sm
                        font-semibold
                        text-white
                        transition-colors
                        hover:bg-primary-light
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-primary
                        focus-visible:ring-offset-2
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    >
                      {deletingEventId !== null ? (
                        <>
                          <LoaderCircle
                            size={17}
                            className="animate-spin"
                            aria-hidden="true"
                          />
      
                          Deleting Event...
                        </>
                      ) : (
                        <>
                          <Trash2
                            size={17}
                            aria-hidden="true"
                          />
      
                          Confirm & Delete
                        </>
                      )}
                    </button>
      
                    <button
                      type="button"
                      onClick={() => {
                        setEventToDelete(null);
                        setDeleteEventError(null);
                      }}
                      disabled={
                        deletingEventId !== null
                      }
                      className="
                        min-h-11
                        w-full
                        rounded-lg
                        border
                        border-grid-line
                        bg-surface
                        px-4
                        font-display
                        text-sm
                        font-semibold
                        text-text
                        transition-colors
                        hover:bg-surface-container
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-primary
                        focus-visible:ring-offset-2
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    >
                      Cancel
                    </button>
                  </div>
                </section>
              </div>
            )}
          </div>
        </main>
      }
    />
</>

);
};

export default EventPage;
