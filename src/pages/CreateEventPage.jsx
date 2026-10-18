import { useNavigate } from "react-router-dom";

import DashboardHeader from "../components/dashboard/DashboardHeader.jsx";
import EventForm from "../components/dashboard/event/EventForm.jsx";

const CreateEventPage = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-content">
      <div className="dashboard-container">
        <DashboardHeader 
          data={{ 
            title: "Create new Event",
            subtitle: "Add a new event to D-Wave entertainment"
          }}
        />

        <EventForm 
          mode="create"
          onCancel={() => navigate("/dashboard")}
        />
      </div>
    </div>
  );
};

export default CreateEventPage;
