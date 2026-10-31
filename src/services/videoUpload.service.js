import axios from "axios";
import axiosPrivate from "../api/axiosPrivate.js";

const getVideoUploadSignature = async () => {
  const response = await axiosPrivate.post(
    "/videos/upload-signature"
  );

  return response.data.data;
};

const verifyVideoUpload = async (publicId) => {
  const response = await axiosPrivate.post(
    "/videos/verify-upload",
    { publicId }
  );

  return response.data.data;
};

const uploadVideoToCloudinary = async (
  file,
  uploadCredentials,
  onProgress
) => {
  const {
    signature,
    timestamp,
    publicId,
    cloudName,
    apiKey,
  } = uploadCredentials;

  const formData = new FormData();

  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("public_id", publicId);
  formData.append("overwrite", "false");

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
    formData,
    {
      onUploadProgress: (progressEvent) => {
        if (!progressEvent.total || !onProgress) return;

        const percentage = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );

        onProgress(percentage);
      },
    }
  );

  return response.data;
};

export {
  getVideoUploadSignature,
  uploadVideoToCloudinary,
  verifyVideoUpload,
};
