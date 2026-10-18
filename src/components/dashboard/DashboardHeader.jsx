const DashboardHeader = ({ 
  data,
}) => { 
  return (
    <div className="dashboard-page-header">

      <div>

        <div className="dashboard-breadcrumb">
          <span>
            ADMIN
          </span>

          <span>
            /
          </span>

          <span className="text-on-background">
            {data.path}
          </span>
        </div>

        <h1 className="dashboard-page-title">
          {data.title}
        </h1>

        <p className="dashboard-page-subtitle">
          {data.subtitle}
        </p>

      </div>
    </div>
  );
};

export default DashboardHeader;
