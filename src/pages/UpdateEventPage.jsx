import { 
  useCallback, 
  useEffect, 
  useState
} from "react";

import {
  AlertCircle,
  ArrowLeft,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import DashboardHeader from "../components/dashboard/DashboardHeader.jsx";
import EventForm from "../components/dashboard/event/EventForm.jsx";

import useEvents from "../hooks/useEvents.js";

const getErrorMessage = (error) =>
  error?.response?.data?.message ??
  error?.message ??
  "Unable to retrieve this event. Please try again.";

const UpdateEventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const { getEvent } = useEvents();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const loadEvent = useCallback(async () => {
    if (!eventId) {
      setLoadError("An event ID is required to update an event.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setLoadError("");
    setEvent(null);

    try {
      const result = await getEvent(eventId);

      if (!result?._id && !result?.id) {
        throw new Error(
          "The requested event could not be found.",
        );
      }

      setEvent(result);
    } catch (error) {
      console.error("Failed to load event for editing:", error);

      setLoadError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [eventId, getEvent]);

  useEffect(() => {
    loadEvent();
  }, [loadEvent]);

  const handleCancel = () => {
    navigate(
      eventId ? `/events/${eventId}` : "/dashboard",
    );
  };

  return (
    <div className="dashboard-content">
      <div className="dashboard-container">
        <DashboardHeader
          data={{
            title: "Update Event",
            subtitle:
              "Review and modify your D-Wave Entertainment event details",
          }}
        />

        {loading && (
          <div
            role="status"
            className="flex min-h-64 flex-col items-center justify-center gap-4 border border-grid-line bg-surface p-8"
          >
            <LoaderCircle
              size={32}
              className="animate-spin text-primary"
              aria-hidden="true"
            />

            <p className="font-mono text-mono-label font-bold uppercase text-muted-slate">
              Loading event details...
            </p>
          </div>
        )}

        {!loading && loadError && (
          <div className="border border-grid-line bg-surface p-6 shadow-neo sm:p-8">
            <div className="flex items-start gap-4">
              <AlertCircle
                size={24}
                className="shrink-0 text-status-red"
                aria-hidden="true"
              />

              <div>
                <h2 className="font-display text-lg font-bold text-on-background">
                  Unable to Load Event
                </h2>

                <p
                  role="alert"
                  className="mt-2 font-body text-sm leading-6 text-muted-slate"
                >
                  {loadError}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-grid-line pt-5 sm:flex-row">
              <button
                type="button"
                onClick={loadEvent}
                className="inline-flex items-center justify-center gap-2 border-2 border-on-background bg-primary px-5 py-3 font-mono text-mono-label font-bold uppercase text-white transition-colors hover:bg-primary-light"
              >
                <RefreshCw size={16} aria-hidden="true" />
                Try Again
              </button>

              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="inline-flex items-center justify-center gap-2 border border-on-background bg-surface px-5 py-3 font-mono text-mono-label font-bold uppercase text-on-surface transition-colors hover:bg-surface-container"
              >
                <ArrowLeft size={16} aria-hidden="true" />
                Back to Dashboard
              </button>
            </div>
          </div>
        )}

        {!loading && !loadError && event && (
          <EventForm
            mode="update"
            event={event}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
};

export default UpdateEventPage;
