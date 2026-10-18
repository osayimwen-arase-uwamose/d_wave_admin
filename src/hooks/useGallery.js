import {
  useCallback,
  useState,
} from "react";

import axiosPrivate from "../api/axiosPrivate.js";

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

  const addGalleryPhoto = 
  useCallback(
    async (
      eventId,
      galleryPhotoData
    ) => { 
      setAdding(true);
      setAddError(null);

      try { 
        const result = await addPhoto(
          eventId,
          galleryPhotoData,
        );

        return result;
      } catch (error) { 
        console.error(
          "Failed to add gallery photo: ",
          error
        );

        setAddError(error);

        throw error;
      } finally { 
        setAdding(false);
      }
    },
    []);

  const deleteGalleryPhoto = 
    useCallback(
      async (
        eventId,
        galleryPhotoId
      ) => { 
        setDeleting(true);
        setDeleteError(null);

        try { 
          const result = await deletePhoto(
            eventId,
            galleryPhotoId,
          );

          return result;
        } catch (error) { 
          console.error(
            "Failed to delete gallery photo: ",
            error
          );

          setDeleteError(error);

          throw error;
        } finally { 
          setDeleting(false);
        }
      },
      []);

  const updateGalleryPhotoCaption = 
    useCallback(
      async (
        eventId,
        galleryPhotoId,
        caption,
      ) => { 
        setUpdatingCaption(true);
        setUpdateCaptionError(null);

        try { 
          const result = await updatePhotoCaption(
            eventId,
            galleryPhotoId,
          );

          return result;
        } catch (error) { 
          console.error(
            "Failed to update gallery photo caption: ",
            error
          );

          setUpdateCaptionError(error);

          throw error;
        } finally { 
          setUpdatingCaption(false);
        }
      },
      []);
  return { 
    adding,
    addError,

    deleting,
    deleteError,

    updatingCaption,
    updateCaptionError,

    addGalleryPhoto,
    deleteGalleryPhoto,
    updateGalleryPhotoCaption,
  };
};

export default useGallery;
