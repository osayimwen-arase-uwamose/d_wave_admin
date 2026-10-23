import {
  ArrowRight,
  History,
  RefreshCw,
} from "lucide-react";

import formatISOTimestamp from "../../../utils/formatISOTimestamp";

const EventCard = ({ 
  event,
  onOpen,
}) => { 
  const isArchived = event.status === "archived";
  
  return (
    <article className="hub-card group">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#080e1c]">
        {event.flyerUrl ? (
          <img
            src={event.flyerUrl}
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#121b2f] to-[#080e1c] text-white/20">
            <span className="text-sm font-medium tracking-wider uppercase">
              No Flyer Available
            </span>
          </div>
        )}

        {/* Ambient Gradient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c1323] via-[#0c1323]/40 to-transparent" />
      </div>

      <div className="hub-card-header">
        <span
          className={
            isArchived
              ? "hub-status hub-status-archived"
              : "hub-status hub-status-active"
          }
        >
          {isArchived
            ? "Archived"
            : "Active"}
        </span>

      </div>

      <div className="event-card-body">

        <h2 className="event-card-title">
          {event.title}
        </h2>

        <p className="hub-card-description">
          {event.description}
        </p>

        <div className="hub-card-meta">

          <div>
            <RefreshCw size={14} />

            <span>
              Updated {
              formatISOTimestamp(event.updatedAt)
              }
            </span>
          </div>

        </div>

      </div>

      <div className="hub-card-footer">

        <button
          type="button"
          onClick={() =>
            onOpen(event)
          }
          className={
            isArchived
              ? "hub-card-action hub-card-action-archived"
              : "hub-card-action"
          }
        >
          {isArchived
            ? "View Archive"
            : "View Event"}

          {isArchived ? (
            <History size={16} />
          ) : (
            <ArrowRight size={16} />
          )}
        </button>

      </div>

    </article>
  );
};

export default EventCard;
