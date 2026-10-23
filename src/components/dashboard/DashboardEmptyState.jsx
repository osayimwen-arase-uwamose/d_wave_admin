import { Inbox } from "lucide-react";

function DashboardEmptyState({
  icon: Icon = Inbox,
  title = "Nothing to display yet",
  description = "Information will appear here when data becomes available.",
  action = null,
}) {
  return (
    <div className="dw-admin-empty-state">
      <div className="dw-admin-empty-state__icon">
        <Icon size={22} aria-hidden="true" />
      </div>

      <h3 className="dw-admin-empty-state__title">
        {title}
      </h3>

      <p className="dw-admin-empty-state__description">
        {description}
      </p>

      {action ? (
        <div className="dw-admin-empty-state__action">
          {action}
        </div>
      ) : null}
    </div>
  );
}

export default DashboardEmptyState;
