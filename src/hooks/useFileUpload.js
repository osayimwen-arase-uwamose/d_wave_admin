import {
  useCallback,
  useState,
} from "react";

import axiosPrivate from "../api/axiosPrivate.js";

import {
  uploadFlyer,
  uploadGalleryPhoto,
  uploadLandingImage,
  uploadAboutImage,
} from "../services/fileUpload.service.js";

const useFileUpload = () => {
  const [uploading, setUploading] =
    useState(false);

  const [uploadError, setUploadError] =
    useState(null);

  const upload = useCallback(
    async (
      uploadFunction,
      file,
    ) => {
      if (!file) {
        throw new Error(
          "An image file is required.",
        );
      }

      setUploading(true);
      setUploadError(null);

      try {
        const result =
          await uploadFunction(
            axiosPrivate,
            file,
          );

        return result;
      } catch (error) {
        console.error(
          "Image upload failed:",
          error,
        );

        setUploadError(error);

        throw error;
      } finally {
        setUploading(false);
      }
    },
    [axiosPrivate],
  );


  const uploadEventFlyer =
    useCallback(
      async (file) => {
        return upload(
          uploadFlyer,
          file,
        );
      },
      [upload],
    );

  const uploadEventGalleryPhoto =
    useCallback(
      async (file) => {
        return upload(
          uploadGalleryPhoto,
          file,
        );
      },
      [upload],
    );


  const uploadLandingPageImage =
    useCallback(
      async (file) => {
        return upload(
          uploadLandingImage,
          file,
        );
      },
      [upload],
    );


  const uploadAboutPageImage =
    useCallback(
      async (file) => {
        return upload(
          uploadAboutImage,
          file,
        );
      },
      [upload],
    );


  return {
    uploadEventFlyer,
    uploadEventGalleryPhoto,
    uploadLandingPageImage,
    uploadAboutPageImage,

    uploading,
    uploadError,
  };
};

export default useFileUpload;
