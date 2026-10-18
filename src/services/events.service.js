import ENDPOINTS from "../data/endpoints";

const { 
  GETONE,
  GETALL,
  CREATE,
  UPDATE,
  DELETE,
} = ENDPOINTS.EVENTS

const getEvent = async (
  axiosPrivate,
  eventId,
) => {
  const response = await axiosPrivate.get(
    GETONE(eventId)
  );

  return response.data;
};

const getEvents = async (
  axiosPrivate,
) => {
  const response = await axiosPrivate.get(
    GETALL
  );

  return response.data;
};

const createEvent = async (
  axiosPrivate,
  eventData
) => {
  const response = await axiosPrivate.post(
    CREATE,
    eventData,
  );

  return response.data;
};

const updateEvent = async (
  axiosPrivate,
  eventId,
  eventData
) => {
  const response = await axiosPrivate.patch(
    UPDATE(eventId),
    eventData
  );

  return response.data;
};

const deleteEvent = async (
  axiosPrivate,
  eventId
) => {
  const response = await axiosPrivate.delete(
    DELETE(eventId)
  );

  return response.data;
};

export { 
  getEvent,
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};
