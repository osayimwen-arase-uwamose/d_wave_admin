import { Plus } from "lucide-react";

const CreateEventCard = ({ 
  onClick,
}) => { 
  return (
    <button
      type="button"
      onClick={onClick}
      className="create-hub-card"
    >
      <div className="create-hub-icon">
        <Plus size={32} />
      </div>

      <h2 className="create-hub-title">
        Create New Event
      </h2>

      <p className="create-hub-subtitle">
        Add new event to D-Wave entertainment
      </p>
    </button>
  );
};

export default CreateEventCard;
