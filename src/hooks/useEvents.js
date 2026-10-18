import {
  useCallback,
  useEffect,
  useState,
} from "react";

import axiosPrivate from "../api/axiosPrivate.js";

import { 
  getEvent,
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../services/events.service.js";

const useEvents = () => {
  const [events, setEvents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  const [creating, setCreating] =
    useState(false);

  const [createError, setCreateError] =
    useState(null);

  const [getting, setGetting] = useState(false);

  const [getError, setGetError] = useState(null);

  const [updating, setUpdating] = useState(false);

  const [updateError, setUpdateError] = useState(null);

  const [deleting, setDeleting] = useState(false);

  const [deleteError, setDeleteError] = useState(null);

  const fetchEvents =
    useCallback(async () => {
      setLoading(true);
      setError(null);

      try {
        const data =
          await getEvents(
            axiosPrivate
          );
       
        setEvents(
          data?.data?.events
        );
      } catch (error) {
        console.error(
          "Failed to fetch Events:",
          error
        );

        setError(error);
      } finally {
        setLoading(false);
      }
    }, [axiosPrivate]);

  const handleGetEvent = 
    useCallback(
      async (eventId) => {
        setGetting(true);
        setGetError(null);

        try {
          const response = await getEvent(
            axiosPrivate,
            eventId,
          );

          const event =
            response?.data?.event ??
            response?.event ??
            response?.data;

          return event;

        } catch (error) {
          console.error(
            "Failed to get Event:",
            error
          );

          setGetError(error);

          throw error;

        } finally {
          setGetting(false);
        }
      },
      [axiosPrivate]
    );

  const handleCreateEvent =
    useCallback(
      async (payload) => {
        setCreating(true);
        setCreateError(null);

        try {
          const response = await createEvent(
            axiosPrivate,
            payload,
          );

          const event =
            response?.data?.event ??
            response?.event ??
            response?.data;

          if (event) {
            setEvents((currentEvents) => [
              event,
              ...currentEvents,
            ]);
          }

          return event;

        } catch (error) {
          console.error(
            "Failed to create Event:",
            error
          );

          setCreateError(error);

          throw error;

        } finally {
          setCreating(false);
        }
      },
      [axiosPrivate]
    );


    const handleUpdateEvent =
      useCallback(
        async (eventId, payload) => {
          setUpdating(true);
          setUpdateError(null);

          try {
            const response = await updateEvent(
              axiosPrivate,
              eventId,
              payload,
            );

            const event =
              response?.data?.event ??
              response?.event ??
              response?.data;

            if (event) {
              setEvents((currentEvents) =>
                currentEvents.map((currentEvent) =>
                  currentEvent._id === event._id
                    ? event
                    : currentEvent
                )
              );
            }

            return event;

          } catch (error) {
            console.error(
              "Failed to update Event:",
              error
            );

            setUpdateError(error);

            throw error;

          } finally {
            setUpdating(false);
          }
        },
        [axiosPrivate]
      );


    const handleDeleteEvent =
      useCallback(
        async (eventId) => {
          setDeleting(true);
          setDeleteError(null);

          try {
            const response = await deleteEvent(
              axiosPrivate,
              eventId,
            );

            const deletedEventId =
              response?.data?.event?._id ??
              response?.event?._id ??
              eventId;

            setEvents((currentEvents) =>
              currentEvents.filter(
                (currentEvent) =>
                  currentEvent._id !== deletedEventId
              )
            );

            return response;

          } catch (error) {
            console.error(
              "Failed to delete Event:",
              error
            );

            setDeleteError(error);

            throw error;

          } finally {
            setDeleting(false);
          }
        },
        [axiosPrivate]
      );

  
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,

    creating,
    createError,

    getting,
    getError,

    updating,
    updateError,

    deleting,
    deleteError,

    refetch: fetchEvents,
    getEvent: handleGetEvent,
    createEvent: handleCreateEvent,
    updateEvent: handleUpdateEvent,
    deleteEvent: handleDeleteEvent,
  };
};

export default useEvents;
