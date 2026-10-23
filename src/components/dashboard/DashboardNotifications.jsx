import {
  Activity,
  ArrowRight,
  Mail,
  CalendarDays,
  Bell,
} from "lucide-react";

import { toast } from "sonner";

import { 
  DASHBOARD_NOTIFICATION_PLACEHOLDERS
} from "../../data/dashboardOverview.js";

import DashboardEmptyState from "./DashboardEmptyState.jsx";

const NOTIFICATION_ICONS = {
  activity: Activity,
  mail: Mail,
  calendar: CalendarDays,
};

function DashboardNotifications({
  notifications = DASHBOARD_NOTIFICATION_PLACEHOLDERS,
  loading = false,
  error = null,
}) {
  const notificationList = Array.isArray(notifications)
    ? notifications
    : [];

  const notConfigured = true;

  return (
    <section className="dw-admin-section">
      <div className="dw-admin-section__header">
        <div>
          <div className="dw-admin-section__title-row">
            <h2 className="dw-admin-section__title">
              Notifications
            </h2>

            {!loading && !error && notificationList.length > 0 ? (
              <span className="dw-admin-count-badge">
                {notConfigured ? "0" : notificationList.length}
              </span>
            ) : null}
          </div>

          <p className="dw-admin-section__description">
            Recent activity and administrative updates.
          </p>
        </div>

        <button
          type="button"
          className="dw-admin-text-button dw-admin-text-button--icon"
          onClick={() => toast.info("You are all caught up")}
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
          Loading notifications…
        </div>
      ) : error ? (
        <DashboardEmptyState
          icon={Bell}
          title="Notifications unavailable"
          description="The activity feed could not be loaded."
        />
      ) : notificationList.length === 0 || notConfigured ? (
        <DashboardEmptyState
          icon={Bell}
          title="You're all caught up"
          description="New administrative activity will appear here."
        />
      ) : (
        <div className="dw-admin-notification-list">
          {notificationList.map((notification) => {
            const Icon =
              NOTIFICATION_ICONS[notification.iconName] ??
              Activity;

            return (
              <article
                key={notification.id}
                className="dw-admin-notification"
              >
                <div className="dw-admin-notification__icon">
                  <Icon
                    size={18}
                    aria-hidden="true"
                  />
                </div>

                <div className="dw-admin-notification__content">
                  <div className="dw-admin-notification__meta">
                    <span className="dw-admin-notification__category">
                      {notification.category}
                    </span>

                    {notification.time ? (
                      <time className="dw-admin-notification__time">
                        {notification.time}
                      </time>
                    ) : null}
                  </div>

                  <h3 className="dw-admin-notification__title">
                    {notification.title}
                  </h3>

                  <p className="dw-admin-notification__description">
                    {notification.description}
                  </p>

                  {notification.isPlaceholder ? (
                    <span className="dw-admin-placeholder-label">
                      PLACEHOLDER
                    </span>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default DashboardNotifications;
