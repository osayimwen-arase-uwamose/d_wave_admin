import {
  useCallback,
  useState,
} from "react";

import { 
  addPhoto,
  deletePhoto,
  updatePhotoCaption,
} from "../services/gallery.service.js"

const useGallery = () => {
  const [adding, setAdding] =
    useState(false);

  const [addError, setAddError] =
    useState(null);

  const [deleting, setDeleting] = useState(false);

  const [deleteError, setDeleteError] = useState(null);

  const [updatingCaption, setUpdatingCaption] = useState(false);

  const [updateCaptionError, setUpdateCaptionError] = useState(null);

  const addGalleryMedia = useCallback(
      async (eventId, mediaData) => {
        setAdding(true);
        setAddError(null);

        try {
          return await addPhoto(eventId, mediaData);
        } catch (error) {
          console.error("Failed to add gallery media:", error);
          setAddError(error);
          throw error;
        } finally {
          setAdding(false);
        }
      },
      []
    );

  const deleteGalleryMedia = useCallback(
      async (eventId, galleryMediaId) => {
        setDeleting(true);
        setDeleteError(null);

        try {
          return await deletePhoto(eventId, galleryMediaId);
        } catch (error) {
          console.error("Failed to delete gallery media:", error);
          setDeleteError(error);
          throw error;
        } finally {
          setDeleting(false);
        }
      },
      []
    );

  const updateGalleryMediaCaption = useCallback(
      async (eventId, galleryMediaId, caption) => {
        setUpdatingCaption(true);
        setUpdateCaptionError(null);

        try {
          return await updatePhotoCaption(
            eventId,
            galleryMediaId,
            caption
          );
        } catch (error) {
          console.error("Failed to update gallery media caption:", error);
          setUpdateCaptionError(error);
          throw error;
        } finally {
          setUpdatingCaption(false);
        }
      },
      []
    );

  return {
    adding,
    addError,

    deleting,
    deleteError,

    updatingCaption,
    updateCaptionError,

    addGalleryMedia,
    deleteGalleryMedia,
    updateGalleryMediaCaption,
  };
};

export default useGallery;
