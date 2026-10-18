const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER:"/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    PROFILE: "/auth/me",
  },

  EVENTS: { 
    GETONE: (eventId) => `/events/${eventId}`,
    GETALL: '/events/',
    CREATE: '/events/',
    UPDATE: (eventId) => `/events/${eventId}`,
    DELETE: (eventId) => `/events/${eventId}`,
  },

  GALLERY: { 
    ADD_PHOTO: (eventId) => `/gallery/${eventId}/add-photo`,

    DELETE_PHOTO: (
      eventId, 
      galleryPhotoId
    ) => `/gallery/${eventId}/delete-photo/${galleryPhotoId}`,

    UPDATE_CAPTION: (
      eventId, 
      galleryPhotoId
    ) => `/gallery/${eventId}/update-caption/${galleryPhotoId}`
  },

  LANDING: { 
    GET: '/landing/',
    UPDATE: '/landing/'
  },

  ABOUT: { 
    GET: '/about/',
    UPDATE: '/about/',
  },
};

export default ENDPOINTS;
