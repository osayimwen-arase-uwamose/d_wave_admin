import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ImagePlus,
  Video,
  Upload,
  X,
  ArrowLeft,
  LoaderCircle,
  CheckCircle2,
} from "lucide-react";

import { toast } from "sonner";

import useEvents from "../hooks/useEvents.js";
import useFileUpload from "../hooks/useFileUpload.js";
import useVideoUpload from "../hooks/useVideoUpload.js";
import useGallery from "../hooks/useGallery.js";

const IMAGE_MAX_SIZE = 24 * 1024 * 1024;
const VIDEO_MAX_SIZE = 100 * 1024 * 1024;

const IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const VIDEO_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/webm",
];

const AddGalleryMediaPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const { getEvent } = useEvents();

  const {
    uploading: uploadingImage,
    uploadEventGalleryPhoto,
  } = useFileUpload();

  const {
    uploading: uploadingVideo,
    uploadProgress,
    uploadEventGalleryVideo,
  } = useVideoUpload();

  const {
    adding,
    addGalleryMedia,
  } = useGallery();

  const [event, setEvent] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(true);

  const [mediaType, setMediaType] = useState("image");
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");

  const isUploading = uploadingImage || uploadingVideo;
  const isProcessing = isUploading || adding;

  useEffect(() => {
    let mounted = true;

    const loadEvent = async () => {
      try {
        setLoadingEvent(true);

        const result = await getEvent(eventId);

        if (mounted) {
          setEvent(result?.body?.event ?? result?.event ?? result);
        }
      } catch (error) {
        console.error("Failed to load event:", error);

        if (mounted) {
          toast.error("Unable to load this event.");
        }
      } finally {
        if (mounted) {
          setLoadingEvent(false);
        }
      }
    };

    loadEvent();

    return () => {
      mounted = false;
    };
  }, [eventId, getEvent]);

  // Generate and clean up preview URL
  const previewUrl = useMemo(() => {
    if (!file) return null;

    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const validateFile = (selectedFile, type) => {
    if (!selectedFile) {
      return "Please select a file.";
    }

    if (type === "image") {
      if (!IMAGE_TYPES.includes(selectedFile.type)) {
        return "Choose a JPG, PNG or WebP image.";
      }

      if (selectedFile.size > IMAGE_MAX_SIZE) {
        return "Images cannot exceed 24 MB.";
      }
    }

    if (type === "video") {
      if (!VIDEO_TYPES.includes(selectedFile.type)) {
        return "Choose an MP4, MOV or WebM video.";
      }

      if (selectedFile.size > VIDEO_MAX_SIZE) {
        return "Videos cannot exceed 100 MB.";
      }
    }

    return "";
  };

  const handleMediaTypeChange = (type) => {
    if (isProcessing) return;

    setMediaType(type);
    setFile(null);
    setError("");
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    setError("");
    setFile(null);

    if (!selectedFile) return;

    const validationError = validateFile(
      selectedFile,
      mediaType
    );

    if (validationError) {
      setError(validationError);
      event.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const validationError = validateFile(file, mediaType);

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      let mediaData;

      if (mediaType === "image") {
        const uploadResult = await uploadEventGalleryPhoto(file);

        const url = uploadResult?.data?.url;
        const publicId = uploadResult?.data?.publicId;

        if (!url || !publicId) {
          throw new Error(
            "Image upload did not return the expected media details."
          );
        }

        mediaData = {
          mediaType: "image",
          galleryPhotoUrl: url,
          publicId,
          caption: caption.trim(),
        };
      } else {
        const uploadResult = await uploadEventGalleryVideo(file);

        const url = uploadResult?.data?.url;
        const publicId = uploadResult?.data?.publicId;

        if (!url || !publicId) {
          throw new Error(
            "Video upload did not return the expected media details."
          );
        }

        mediaData = {
          mediaType: "video",
          videoUrl: url,
          publicId,
          caption: caption.trim(),
        };
      }

      await addGalleryMedia(eventId, mediaData);

      toast.success(
        `${mediaType === "image" ? "Image" : "Video"} added to gallery successfully.`
      );

      navigate(`/events/${eventId}`);
    } catch (error) {
      console.error("Failed to add gallery media:", error);

      const message =
        error.response?.data?.message ||
        error.message ||
        "Unable to add media to the gallery.";

      setError(message);
      toast.error(message);
    }
  };

  if (loadingEvent) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoaderCircle className="h-7 w-7 animate-spin text-primary" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h2 className="text-xl font-semibold">
          Event not found
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          We couldn't find the event you're trying to update.
        </p>

        <button
          type="button"
          onClick={() => navigate("/dashboard/events")}
          className="mt-6 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white"
        >
          Back to Events
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">

      {/* Header */}
      <button
        type="button"
        onClick={() => navigate(`/events/${eventId}`)}
        disabled={isProcessing}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-primary disabled:opacity-50"
      >
        <ArrowLeft size={17} />
        Back to Event
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Add to Gallery
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Add photos or videos to the gallery for{" "}
          <span className="font-semibold text-gray-700">
            {event.title}
          </span>
          .
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-7">

        {/* Media type selection */}
        <section>
          <label className="mb-3 block text-sm font-semibold text-gray-800">
            Choose media type
          </label>

          <div className="grid grid-cols-2 gap-4">

            <button
              type="button"
              onClick={() => handleMediaTypeChange("image")}
              disabled={isProcessing}
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                mediaType === "image"
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                <ImagePlus size={22} />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Image
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  JPG, PNG, WebP
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleMediaTypeChange("video")}
              disabled={isProcessing}
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                mediaType === "video"
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                <Video size={22} />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Video
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  MP4, MOV, WebM
                </p>
              </div>
            </button>

          </div>
        </section>

        {/* File selection */}
        <section>
          <label className="mb-3 block text-sm font-semibold text-gray-800">
            Select {mediaType}
          </label>

          <label
            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition ${
              file
                ? "border-primary/40 bg-primary/5"
                : "border-gray-300 hover:border-primary/50 hover:bg-gray-50"
            } ${isProcessing ? "pointer-events-none opacity-60" : ""}`}
          >
            <Upload className="mb-3 h-8 w-8 text-gray-400" />

            <span className="text-sm font-semibold text-gray-800">
              Click to select {mediaType}
            </span>

            <span className="mt-2 text-xs text-gray-500">
              {mediaType === "image"
                ? "JPG, PNG or WebP · Maximum 24 MB"
                : "MP4, MOV or WebM · Maximum 100 MB"}
            </span>

            <input
              type="file"
              accept={
                mediaType === "image"
                  ? "image/jpeg,image/png,image/webp"
                  : "video/mp4,video/quicktime,video/webm"
              }
              onChange={handleFileChange}
              disabled={isProcessing}
              className="hidden"
            />
          </label>

          {file && (
            <div className="mt-3 flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-800">
                  {file.name}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>

              <button
                type="button"
                onClick={() => setFile(null)}
                disabled={isProcessing}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-red-500"
                aria-label="Remove selected file"
              >
                <X size={18} />
              </button>
            </div>
          )}
        </section>

        {/* Preview */}
        {previewUrl && (
          <section>
            <h2 className="mb-3 text-sm font-semibold text-gray-800">
              Preview
            </h2>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
              {mediaType === "image" ? (
                <img
                  src={previewUrl}
                  alt="Gallery preview"
                  className="max-h-[420px] w-full object-contain"
                />
              ) : (
                <video
                  src={previewUrl}
                  controls
                  preload="metadata"
                  className="max-h-[420px] w-full bg-black"
                >
                  Your browser does not support video playback.
                </video>
              )}
            </div>
          </section>
        )}

        {/* Upload progress */}
        {uploadingVideo && (
          <section className="rounded-xl border border-gray-200 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Uploading video...
              </span>

              <span className="text-sm font-semibold text-primary">
                {uploadProgress}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </section>
        )}

        {/* Caption */}
        <section>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="caption"
              className="text-sm font-semibold text-gray-800"
            >
              Caption
              <span className="ml-1 font-normal text-gray-400">
                (Optional)
              </span>
            </label>

            <span className="text-xs text-gray-400">
              {caption.length}/150
            </span>
          </div>

          <textarea
            id="caption"
            value={caption}
            onChange={(event) => setCaption(event.target.value.slice(0, 150))}
            placeholder="Add a caption to this moment..."
            rows={3}
            maxLength={150}
            disabled={isProcessing}
            className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:bg-gray-50"
          />
        </section>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={() => navigate(`/events/${eventId}`)}
            disabled={isProcessing}
            className="rounded-lg border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={!file || isProcessing}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />

                {uploadingVideo
                  ? "Uploading video..."
                  : uploadingImage
                    ? "Uploading image..."
                    : "Saving to gallery..."}
              </>
            ) : (
              <>
                <CheckCircle2 size={17} />
                Add to Gallery
              </>
            )}
          </button>

        </div>
      </form>
    </div>
  );
};

export default AddGalleryMediaPage;
