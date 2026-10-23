import { Link } from "react-router-dom";

const DashboardNavItem = ({ 
  to,
  icon: Icon,
  label,
  active = false,
}) => { 
  return (
    <Link
      to={to}
      className={
        active
          ? "dashboard-nav-item dashboard-nav-item-active"
          : "dashboard-nav-item"
      }
    >
      <Icon size={20} />

      <span>
        {label}
      </span>
    </Link>
  );
}

export default DashboardNavItem;