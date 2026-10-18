import { Link } from "react-router-dom";

import DASHBOARD_HEADERS from "../data/dashboardHeaders.js";

import DashboardShell from "../components/dashboard/DashboardShell.jsx";

const DashboardPage = () => { 
  const Workspace = () => { 
    return ( 
      <div>Dashboard Metrics</div>
    )
  }

  const DashboardPath = () => { 
    return (
      <div className="flex gap-2"> 
        <Link to={"/dashboard"}>
          DASHBOARD
        </Link>
      </div>
    )
  }

  return (
    <DashboardShell 
      headerData={{ 
        ...DASHBOARD_HEADERS.DASHBOARD,
        path: <DashboardPath />
      }}
      workspace={<Workspace />}
      selected="dashboard"
    />
  );
};

export default DashboardPage;
