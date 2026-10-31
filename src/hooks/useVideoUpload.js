import { useCallback, useState } from "react";

import {
  getVideoUploadSignature,
  uploadVideoToCloudinary,
  verifyVideoUpload,
} from "../services/videoUpload.service.js";

const MAX_VIDEO_SIZE = 100 * 1024 * 1024;

const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/webm",
];

const useVideoUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);

  const uploadEventGalleryVideo = useCallback(
    async (file) => {
      setUploading(true);
      setUploadProgress(0);
      setUploadError(null);

      try {
        if (!file) {
          throw new Error("Please select a video to upload.");
        }

        if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
          throw new Error(
            "Unsupported video format. Use MP4, MOV or WebM."
          );
        }

        if (file.size > MAX_VIDEO_SIZE) {
          throw new Error(
            "Video cannot exceed 100 MB."
          );
        }

        const credentials = await getVideoUploadSignature();

        const uploadedVideo = await uploadVideoToCloudinary(
          file,
          credentials,
          setUploadProgress
        );

        const verifiedVideo = await verifyVideoUpload(
          uploadedVideo.public_id
        );

        return {
          success: true,
          data: {
            url: verifiedVideo.url,
            publicId: verifiedVideo.publicId,
            duration: verifiedVideo.duration,
            format: verifiedVideo.format,
            bytes: verifiedVideo.bytes,
          },
        };
      } catch (error) {
        console.error("Video upload failed:", error);

        const message =
          error.response?.data?.message ||
          error.message ||
          "Unable to upload video.";

        setUploadError(message);

        throw error;
      } finally {
        setUploading(false);
      }
    },
    []
  );

  return {
    uploading,
    uploadProgress,
    uploadError,
    uploadEventGalleryVideo,
  };
};

export default useVideoUpload;
