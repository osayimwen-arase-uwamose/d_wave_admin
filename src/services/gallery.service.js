import ENDPOINTS from "../data/endpoints.js";
import axiosPrivate from "../api/axiosPrivate.js";

const { 
  ADD_PHOTO,
  DELETE_PHOTO,
  UPDATE_CAPTION,
} = ENDPOINTS.GALLERY;

const addPhoto = async (
  eventId,
  photoData,
) => {
  const response = await axiosPrivate.post(
    `/gallery/${eventId}`,
    photoData,
  );

  return response.data;
};

const updatePhotoCaption = async (
  eventId,
  galleryPhotoId,
  caption,
) => {
  const response = await axiosPrivate.patch(
    `/gallery/${eventId}/${galleryPhotoId}`,
    { caption },
  );

  return response.data;
};

const deletePhoto = async (
  eventId,
  galleryPhotoId,
) => {
  const response = await axiosPrivate.delete(
    `/gallery/${eventId}/${galleryPhotoId}`,
  );

  return response.data;
};

export { 
  addPhoto,
  updatePhotoCaption,
  deletePhoto,
};
