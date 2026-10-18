import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CloudUpload,
  ImagePlus,
  LoaderCircle,
  MapPin,
  Upload,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { toast } from "sonner";

import useEvents from "../hooks/useEvents.js";
import useFileUpload from "../hooks/useFileUpload.js";
import useGallery from "../hooks/useGallery.js";

import DashboardShell from "../components/dashboard/DashboardShell.jsx";

const MAX_CAPTION_LENGTH = 150;

const AddGalleryPhotoPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const {
    getEvent,
    getting,
  } = useEvents();

  const {
    uploadEventGalleryPhoto,
    uploading,
  } = useFileUpload();

  const { 
    adding,
    addError,
    addGalleryPhoto,
  } = useGallery()

  const [event, setEvent] =
    useState(null);

  const [file, setFile] =
    useState(null);

  const [previewUrl, setPreviewUrl] =
    useState("");

  const [caption, setCaption] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!eventId) {
      return;
    }

    const loadEvent = async () => {
      try {
        const eventData =
          await getEvent(eventId);

        setEvent(eventData);
      } catch (loadError) {
        console.error(
          "Failed to load event:",
          loadError,
        );

        toast.error(
          "Unable to load event.",
        );
      }
    };

    loadEvent();
  }, [
    eventId,
    getEvent,
  ]);

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return;
    }

    const objectUrl =
      URL.createObjectURL(file);

    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  const handleFileChange = (
    selectedFile,
  ) => {
    setError("");

    if (!selectedFile) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        selectedFile.type,
      )
    ) {
      setFile(null);

      setError(
        "Please select a JPG, PNG, or WEBP image.",
      );

      if (fileInputRef.current) {
        fileInputRef.current.value =
          "";
      }

      return;
    }

    const maxSize =
      24 * 1024 * 1024;

    if (
      selectedFile.size >
      maxSize
    ) {
      setFile(null);

      setError(
        "The image must be smaller than 24MB.",
      );

      if (fileInputRef.current) {
        fileInputRef.current.value =
          "";
      }

      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (event) => {
    event.preventDefault();

    const droppedFile =
      event.dataTransfer.files?.[0];

    handleFileChange(
      droppedFile,
    );
  };

  const handleSubmit = async () => {
    setError("");

    if (!file) {
      setError(
        "Please select an image.",
      );
      return;
    }

    if (!eventId) {
      setError(
        "Event ID is missing.",
      );
      return;
    }

    try {
      const uploadResult =
        await uploadEventGalleryPhoto(
          file,
        );

      const galleryPhotoUrl =
        uploadResult?.data?.url;

      const publicId =
        uploadResult?.data?.publicId;

      if (
        !galleryPhotoUrl ||
        !publicId
      ) {
        throw new Error(
          "Image upload completed but no Cloudinary asset details were returned.",
        );
      };

      await addGalleryPhoto(
        eventId,
        {
          galleryPhotoUrl,
          publicId,
          caption:
            caption.trim(),
        },
      );

      toast.success(
        "Photo added to the gallery.",
      );

      navigate(
        `/dashboard/events/${eventId}`,
      );
    } catch (error) {
      console.error(
        "Failed to add gallery photo:",
        error,
      );

      const message =
        error?.response?.data
          ?.message ??
        error?.message ??
        "Failed to add photo to the gallery.";

      setError(message);

      toast.error(message);
    } 
  };

  const isBusy =
    uploading || adding;

  if (getting || !event) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3">
          <LoaderCircle
            size={22}
            className="animate-spin text-primary"
          />

          <span className="font-mono text-xs font-bold uppercase tracking-[0.1em] text-text-muted">
            Loading Event...
          </span>
        </div>
      </div>
    );
  }

  const DashboardPath = () => { 

  };

  return (
    <DashboardShell
      headerData={{
        title: "Add Gallery Image",
        subtitle: "",
        path: (
          <p>
            EVENTS{" "}
            <span>/</span>{" "}
            <span>{event.title}</span>{" "}
            <span>/</span>{" "}
            <span>ADD IMAGE</span>
          </p>
        ),
      }}
      workspace={
        <main className="w-full bg-background">
          <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">

            {/* Back / Context */}
            <div className="mb-6 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/events/${eventId}`,
                  )
                }
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-lg
                  border
                  border-on-background
                  bg-surface
                  px-3
                  py-2
                  font-display
                  text-sm
                  font-semibold
                  text-on-background
                  transition
                  hover:bg-surface-container
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-primary
                  focus-visible:ring-offset-2
                "
              >
                <ArrowLeft
                  size={17}
                  aria-hidden="true"
                />

                Back to Event
              </button>

              <span
                className="
                  font-mono
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.12em]
                  text-text-muted
                "
              >
                Gallery Asset
              </span>
            </div>

            {/* Heading */}
            <section className="mb-8">
              <p
                className="
                  mb-2
                  font-mono
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.14em]
                  text-text-muted
                "
              >
                EVENT GALLERY
              </p>

              <h1
                className="
                  font-display
                  text-2xl
                  font-bold
                  tracking-tight
                  text-primary
                  sm:text-3xl
                "
              >
                Add Image
              </h1>

              <p
                className="
                  mt-2
                  max-w-2xl
                  font-body
                  text-sm
                  leading-6
                  text-text-muted
                "
              >
                Add a visual memory from this
                event to its gallery.
              </p>
            </section>

            {/* Event Context */}
            <section
              className="
                mb-6
                border
                border-on-background
                bg-surface
                p-5
                shadow-neo-sm
              "
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p
                    className="
                      font-mono
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.12em]
                      text-text-muted
                    "
                  >
                    EVENT
                  </p>

                  <h2
                    className="
                      mt-1
                      truncate
                      font-display
                      text-lg
                      font-semibold
                      text-primary
                    "
                  >
                    {event.title}
                  </h2>
                </div>

                <div className="flex flex-wrap gap-x-5 gap-y-2">
                  <div className="flex items-center gap-2">
                    <CalendarDays
                      size={16}
                      className="text-primary"
                      aria-hidden="true"
                    />

                    <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-muted">
                      {new Date(
                        event.scheduledAt,
                      ).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin
                      size={16}
                      className="text-primary"
                      aria-hidden="true"
                    />

                    <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-muted">
                      {event.venue}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Main Form */}
            <section
              className="
                border
                border-on-background
                bg-surface
                p-5
                shadow-neo-sm
                sm:p-6
              "
            >
              {/* Image */}
              <div className="mb-7">
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="gallery-photo"
                    className="
                      font-mono
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.12em]
                      text-primary
                    "
                  >
                    IMAGE
                  </label>

                  <span
                    className="
                      font-mono
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.1em]
                      text-status-red
                    "
                  >
                    REQUIRED *
                  </span>
                </div>

                <input
                  ref={fileInputRef}
                  id="gallery-photo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={(inputEvent) =>
                    handleFileChange(
                      inputEvent.target.files?.[0],
                    )
                  }
                />

                {!previewUrl ? (
                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    onDragOver={(dragEvent) =>
                      dragEvent.preventDefault()
                    }
                    onDrop={handleDrop}
                    disabled={isBusy}
                    className="
                      flex
                      min-h-56
                      w-full
                      flex-col
                      items-center
                      justify-center
                      border
                      border-dashed
                      border-on-background
                      bg-surface-container-low
                      px-6
                      text-center
                      transition
                      hover:bg-surface-container
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    <div
                      className="
                        mb-4
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-full
                        bg-surface-container
                        text-primary
                      "
                    >
                      <CloudUpload
                        size={24}
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    </div>

                    <span
                      className="
                        font-display
                        text-base
                        font-semibold
                        text-primary
                      "
                    >
                      Select an image
                    </span>

                    <span
                      className="
                        mt-1
                        font-body
                        text-xs
                        leading-5
                        text-text-muted
                      "
                    >
                      JPG, PNG, or WEBP · Max 24MB
                    </span>
                  </button>
                ) : (
                  <div className="overflow-hidden border border-on-background bg-surface">
                    <div className="relative aspect-video bg-surface-container">
                      <img
                        src={previewUrl}
                        alt="Gallery preview"
                        className="h-full w-full object-cover"
                      />

                      <div className="absolute left-3 top-3 flex items-center gap-2 bg-primary px-2.5 py-1.5 text-white">
                        <CheckCircle2
                          size={14}
                          aria-hidden="true"
                        />

                        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.1em]">
                          Ready
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-on-background p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="truncate font-body text-sm font-semibold text-primary">
                          {file.name}
                        </p>

                        <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.08em] text-text-muted">
                          {(
                            file.size /
                            (1024 * 1024)
                          ).toFixed(2)}{" "}
                          MB
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setFile(null);

                          if (
                            fileInputRef.current
                          ) {
                            fileInputRef.current.value =
                              "";
                          }
                        }}
                        disabled={isBusy}
                        className="
                          shrink-0
                          border
                          border-on-background
                          bg-surface
                          px-3
                          py-2
                          font-display
                          text-xs
                          font-semibold
                          text-primary
                          transition
                          hover:bg-surface-container
                          disabled:opacity-60
                        "
                      >
                        Change Image
                      </button>
                    </div>
                  </div>
                )}

                {error && (
                  <p
                    className="
                      mt-2
                      font-body
                      text-xs
                      font-medium
                      text-status-red
                    "
                  >
                    {error}
                  </p>
                )}
              </div>

              {/* Caption */}
              <div className="mb-7">
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="gallery-caption"
                    className="
                      font-mono
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.12em]
                      text-primary
                    "
                  >
                    CAPTION
                  </label>

                  <span
                    className="
                      font-mono
                      text-[10px]
                      uppercase
                      tracking-[0.08em]
                      text-text-muted
                    "
                  >
                    {caption.length}/
                    {MAX_CAPTION_LENGTH}
                  </span>
                </div>

                <textarea
                  id="gallery-caption"
                  value={caption}
                  onChange={(inputEvent) =>
                    setCaption(
                      inputEvent.target.value,
                    )
                  }
                  maxLength={
                    MAX_CAPTION_LENGTH
                  }
                  rows={4}
                  placeholder="Describe this performance or backstage moment..."
                  className="
                    w-full
                    resize-none
                    border
                    border-on-background
                    bg-surface-container-low
                    px-3
                    py-3
                    font-body
                    text-sm
                    leading-6
                    text-primary
                    placeholder:text-text-muted
                    focus:border-primary
                    focus:outline-none
                    focus:ring-2
                    focus:ring-primary/10
                  "
                />
              </div>

              {/* Preview */}
              {previewUrl && (
                <div className="mb-7">
                  <div className="mb-2">
                    <span
                      className="
                        font-mono
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.12em]
                        text-primary
                      "
                    >
                      PREVIEW
                    </span>
                  </div>

                  <div className="overflow-hidden border border-on-background bg-surface">
                    <div className="relative aspect-video bg-surface-container">
                      <img
                        src={previewUrl}
                        alt={
                          caption.trim() ||
                          "Gallery image preview"
                        }
                        className="h-full w-full object-cover"
                      />

                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/85 to-transparent px-4 pb-4 pt-10">
                        <p className="font-display text-sm font-semibold text-white">
                          {event.title}
                        </p>

                        <p className="mt-1 line-clamp-2 font-body text-xs leading-5 text-white/80">
                          {caption.trim() ||
                            "No caption provided yet for this photo."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-3 border-t border-on-background pt-6 sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={
                    isBusy || !file
                  }
                  className="
                    inline-flex
                    min-h-12
                    flex-1
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    bg-primary
                    px-5
                    font-display
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-primary-light
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-primary
                    focus-visible:ring-offset-2
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {isBusy ? (
                    <>
                      <LoaderCircle
                        size={18}
                        className="animate-spin"
                        aria-hidden="true"
                      />

                      <span>
                        {uploading
                          ? "Uploading Image..."
                          : "Saving to Gallery..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload
                        size={18}
                        aria-hidden="true"
                      />

                      <span>
                        Save to Gallery
                      </span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/dashboard/events/${eventId}`,
                    )
                  }
                  disabled={isBusy}
                  className="
                    min-h-12
                    flex-1
                    rounded-lg
                    border
                    border-on-background
                    bg-surface
                    px-5
                    font-display
                    text-sm
                    font-semibold
                    text-primary
                    transition
                    hover:bg-surface-container
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-primary
                    focus-visible:ring-offset-2
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  Cancel
                </button>
              </div>
            </section>
          </div>
        </main>
      }
    />
  );
};

export default AddGalleryPhotoPage;
