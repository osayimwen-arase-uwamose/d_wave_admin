import { ArrowUpRight } from "lucide-react";

function OverviewStatCard({
  title,
  description,
  icon: Icon,
  value,
  footerLabel,
  footerType = "neutral",
}) {
  const isUnavailable = value === null || value === undefined;

  const displayValue = isUnavailable
    ? "—"
    : value;

  return (
    <article
      className="dw-admin-stat-card"
      aria-label={`${title}: ${displayValue}`}
    >
      <div className="dw-admin-stat-card__top">
        <div className="dw-admin-stat-card__heading">
          <p className="dw-admin-stat-card__label">
            {title}
          </p>

          <p className="dw-admin-stat-card__description">
            {description}
          </p>
        </div>

        <div className="dw-admin-stat-card__icon">
          <Icon size={19} aria-hidden="true" />
        </div>
      </div>

      <div className="dw-admin-stat-card__bottom">
        <p className="dw-admin-stat-card__value">
          {displayValue}
        </p>

        <div
          className={[
            "dw-admin-stat-card__footer",
            `dw-admin-stat-card__footer--${footerType}`,
          ].join(" ")}
        >
          {!isUnavailable && footerType === "positive" ? (
            <ArrowUpRight
              size={14}
              aria-hidden="true"
            />
          ) : null}

          <span>{footerLabel}</span>
        </div>
      </div>
    </article>
  );
}

export default OverviewStatCard;
