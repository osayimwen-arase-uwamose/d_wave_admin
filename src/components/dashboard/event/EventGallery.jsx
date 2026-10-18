import { 
  AlertCircle,
  Check,
  ImageOff,
  LoaderCircle,
  Pencil,
  Save,
  Trash2,
  X,
} from "lucide-react";

import { 
  useEffect,
  useState,
} from "react";

import { toast } from "sonner";

import { 
  updatePhotoCaption,
  deletePhoto,
 } from "../../../services/gallery.service.js";

 const MAX_CAPTION_LENGTH = 150;

const EventGallery = ({
event,
onRefresh,
}) => {
  const images = event?.galleryPhotos ?? []; 

  const [editingPhotoId, setEditingPhotoId] = useState(null);

  const [draftCaption, setDraftCaption] = useState("");

  const [savingCaption, setSavingCaption] = useState(false);

  const [deletingPhotoId, setDeletingPhotoId] = useState(null);

  const [photoToDelete, setPhotoToDelete] = useState(null);

  const [deleteError, setDeleteError] = useState("");

  const [deleteErrorId, setDeleteErrorId] = useState(null);

  const isBusy = savingCaption || deletingPhotoId !== null;

  useEffect(() => {
    if (!photoToDelete) {
      return undefined;
    };

    const handleKeyDown = (keyboardEvent) => {
      if (keyboardEvent.key === "Escape") {
        if (deletingPhotoId === null) {
          setPhotoToDelete(null);
          setDeleteError("");
        }
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    photoToDelete,
    deletingPhotoId,
  ]);

  const handleStartEditing = (image) => {
    setEditingPhotoId(image._id);
    setDraftCaption(image.caption ?? "");
  };

  const handleCancelEditing = () => {
    setEditingPhotoId(null);
    setDraftCaption("");
  };

  const handleSaveCaption = async (
    galleryPhotoId,
  ) => {
    if (!event?._id || !galleryPhotoId) {
      toast.error(
        "Unable to identify the gallery photo.",
      );
      return;
    };

    setSavingCaption(true);

    try {
      await updatePhotoCaption(
        event._id,
        galleryPhotoId,
        draftCaption.trim(),
      );

      setEditingPhotoId(null);
      setDraftCaption("");

      toast.success(
        "Photo caption updated successfully.",
      );

      await onRefresh?.();
    } catch (error) {
      console.error(
        "Failed to update gallery caption:",
        error,
      );

      toast.error(
        error?.response?.data?.message ??
          "Unable to update the photo caption.",
      );
    } finally {
      setSavingCaption(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (
      !event?._id ||
      !photoToDelete?._id
    ) {
      setDeleteError(
        "The event or gallery photo could not be identified.",
      );
      return;
    }

    const galleryPhotoId =
      photoToDelete._id;

    setDeleteError("");
    setDeleteErrorId(null);
    setDeletingPhotoId(galleryPhotoId);

    try {
      await deletePhoto(
        event._id,
        galleryPhotoId,
      );

      setPhotoToDelete(null);

      toast.success(
        "Photo deleted from the gallery.",
      );

      await onRefresh?.();
    } catch (error) {
      console.error(
        "Failed to delete gallery photo:",
        error,
      );

      setDeleteError(
        error?.response?.data?.message ??
          "Unable to delete this photo. Please try again.",
      );

      setDeleteErrorId(galleryPhotoId);

      toast.error(
        error?.response?.data?.message ??
          "Unable to delete the gallery photo.",
      );
    } finally {
      setDeletingPhotoId(null);
    }
  };

  if (!images.length) {
    return (
      <div
        className="
          flex
          flex-col
          items-center
          justify-center
          border
          border-dashed
          border-grid-line
          bg-surface
          px-6
          py-12
          text-center
        "
      >
        <ImageOff
          size={28}
          strokeWidth={1.6}
          className="mb-4 text-text-muted"
          aria-hidden="true"
        />

        <h3
          className="
            font-display
            text-base
            font-semibold
            text-primary
          "
        >
          No gallery photos yet
        </h3>

        <p
          className="
            mt-2
            max-w-sm
            font-body
            text-sm
            leading-6
            text-text-muted
          "
        >
          Photos added to this event will
          appear here. Use Add Image to Gallery
          to get started.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-5">
        {/* Gallery heading */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2
              className="
                font-display
                text-lg
                font-bold
                tracking-tight
                text-primary
              "
            >
              Event Gallery
            </h2>

            <p
              className="
                mt-1
                font-body
                text-xs
                text-text-muted
              "
            >
              Manage the photos and captions
              associated with "{event.title}".
            </p>
          </div>

          <span
            className="
              shrink-0
              border
              border-grid-line
              bg-surface
              px-2.5
              py-1.5
              font-mono
              text-[10px]
              font-bold
              uppercase
              tracking-[0.08em]
              text-text-muted
            "
          >
            {images.length}{" "}
            {images.length === 1
              ? "PHOTO"
              : "PHOTOS"}
          </span>
        </div>

        {/* Gallery cards */}
        <div
          className="
            grid
            grid-cols-1
            gap-5
            md:grid-cols-2
          "
        >
          {images.map((image, index) => {
            const galleryPhotoId =
              image._id;

            const imageUrl =
              image.galleryPhotoUrl;

            const caption =
              image.caption ?? "";

            const isEditing =
              editingPhotoId ===
              galleryPhotoId;

            const isDeleting =
              deletingPhotoId ===
              galleryPhotoId;

            return (
              <article
                key={
                  galleryPhotoId ??
                  image.publicId ??
                  index
                }
                className="
                  overflow-hidden
                  border
                  border-grid-line
                  bg-surface
                  shadow-neo-sm
                "
              >
                {/* Image */}
                <div
                  className="
                    relative
                    aspect-video
                    bg-surface-container
                  "
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={
                        caption ||
                        `Gallery image ${index + 1}`
                      }
                      className="
                        h-full
                        w-full
                        object-cover
                      "
                    />
                  ) : (
                    <div
                      className="
                        flex
                        h-full
                        items-center
                        justify-center
                        text-text-muted
                      "
                    >
                      <ImageOff
                        size={28}
                        aria-hidden="true"
                      />
                    </div>
                  )}

                  <span
                    className="
                      absolute
                      right-3
                      top-3
                      bg-primary/90
                      px-2
                      py-1
                      font-mono
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[0.1em]
                      text-white
                    "
                  >
                    IMG_
                    {String(index + 1).padStart(
                      2,
                      "0",
                    )}
                  </span>
                </div>

                {/* Caption and metadata */}
                <div className="space-y-4 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className="
                        font-mono
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.1em]
                        text-text-muted
                      "
                    >
                      CAPTION
                    </span>

                    { 
                      isEditing && (
                        <span
                          className="
                            font-mono
                            text-[9px]
                            text-text-muted
                          "
                        >
                          {caption.length}/
                          {MAX_CAPTION_LENGTH}
                        </span>
                      ) 
                    }
                  </div>

                  {/* Inline caption editor */}
                  {isEditing ? (
                    <div className="space-y-3">
                      <textarea
                        value={draftCaption}
                        onChange={(inputEvent) =>
                          setDraftCaption(
                            inputEvent.target.value,
                          )
                        }
                        maxLength={
                          MAX_CAPTION_LENGTH
                        }
                        rows={3}
                        autoFocus
                        aria-label="Edit photo caption"
                        className="
                          w-full
                          resize-none
                          border
                          border-grid-line
                          bg-surface-container
                          px-3
                          py-2.5
                          font-body
                          text-sm
                          leading-6
                          text-text
                          placeholder:text-text-muted
                          focus:border-primary
                          focus:outline-none
                          focus:ring-2
                          focus:ring-primary/10
                          disabled:cursor-not-allowed
                          disabled:opacity-60
                        "
                        placeholder="Describe this moment..."
                        disabled={savingCaption}
                      />

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleSaveCaption(
                              galleryPhotoId,
                            )
                          }
                          disabled={
                            savingCaption
                          }
                          className="
                            inline-flex
                            flex-1
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            bg-primary
                            px-3
                            py-2.5
                            font-display
                            text-xs
                            font-semibold
                            text-white
                            transition-colors
                            hover:bg-primary-light
                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-primary
                            focus-visible:ring-offset-2
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                          "
                        >
                          {savingCaption ? (
                            <LoaderCircle
                              size={15}
                              className="animate-spin"
                              aria-hidden="true"
                            />
                          ) : (
                            <Save
                              size={15}
                              aria-hidden="true"
                            />
                          )}

                          {savingCaption
                            ? "Saving..."
                            : "Save Caption"}
                        </button>

                        <button
                          type="button"
                          onClick={
                            handleCancelEditing
                          }
                          disabled={
                            savingCaption
                          }
                          className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            border
                            border-grid-line
                            bg-surface
                            px-3
                            py-2.5
                            font-display
                            text-xs
                            font-semibold
                            text-text
                            transition-colors
                            hover:bg-surface-container
                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-primary
                            focus-visible:ring-offset-2
                            disabled:opacity-60
                          "
                        >
                          <X
                            size={15}
                            aria-hidden="true"
                          />

                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p
                      className="
                        min-h-10
                        break-words
                        font-body
                        text-sm
                        leading-6
                        text-text
                      "
                    >
                      {caption ||
                        "No caption provided."}
                    </p>
                  )}

                  {/* Card actions */}
                  {!isEditing && (
                    <div
                      className="
                        flex
                        flex-col
                        gap-2
                        border-t
                        border-grid-line
                        pt-4
                        sm:flex-row
                      "
                    >
                      <button
                        type="button"
                        onClick={() =>
                          handleStartEditing(
                            image,
                          )
                        }
                        disabled={isBusy}
                        className="
                          inline-flex
                          min-h-10
                          flex-1
                          items-center
                          justify-center
                          gap-2
                          rounded-lg
                          border
                          border-grid-line
                          bg-surface
                          px-3
                          py-2
                          font-display
                          text-xs
                          font-semibold
                          text-primary
                          transition-colors
                          hover:bg-surface-container
                          focus-visible:outline-none
                          focus-visible:ring-2
                          focus-visible:ring-primary
                          focus-visible:ring-offset-2
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                        "
                      >
                        <Pencil
                          size={15}
                          aria-hidden="true"
                        />

                        Edit Caption
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setDeleteError("");
                          setDeleteErrorId(null);
                          setPhotoToDelete(image);
                        }}
                        disabled={isBusy}
                        className="
                          inline-flex
                          min-h-10
                          flex-1
                          items-center
                          justify-center
                          gap-2
                          rounded-lg
                          border
                          border-grid-line
                          bg-surface
                          px-3
                          py-2
                          font-display
                          text-xs
                          font-semibold
                          text-status-red
                          transition-colors
                          hover:bg-red-50
                          focus-visible:outline-none
                          focus-visible:ring-2
                          focus-visible:ring-red-500
                          focus-visible:ring-offset-2
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                        "
                      >
                        {isDeleting ? (
                          <LoaderCircle
                            size={15}
                            className="animate-spin"
                            aria-hidden="true"
                          />
                        ) : (
                          <Trash2
                            size={15}
                            aria-hidden="true"
                          />
                        )}

                        Delete Photo
                      </button>
                    </div>
                  )}

                  {/* Inline delete error */}
                  {deleteError &&
                    deleteErrorId ===
                      galleryPhotoId && (
                      <p
                        role="alert"
                        className="
                          flex
                          items-start
                          gap-2
                          font-body
                          text-xs
                          leading-5
                          text-status-red
                        "
                      >
                        <AlertCircle
                          size={15}
                          className="mt-0.5 shrink-0"
                          aria-hidden="true"
                        />

                        {deleteError}
                      </p>
                    )}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {photoToDelete && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            overflow-y-auto
            bg-primary/50
            p-4
            backdrop-blur-[2px]
          "
          onMouseDown={(mouseEvent) => {
            if (
              mouseEvent.target ===
                mouseEvent.currentTarget &&
              deletingPhotoId === null
            ) {
              setPhotoToDelete(null);
              setDeleteError("");
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-gallery-title"
            aria-describedby="delete-gallery-description"
            className="
              relative
              w-full
              max-w-md
              border
              border-grid-line
              bg-surface
              p-5
              shadow-neo
              sm:p-6
            "
          >
            {/* Dialog header */}
            <div className="mb-5 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setPhotoToDelete(null);
                  setDeleteError("");
                }}
                disabled={
                  deletingPhotoId !== null
                }
                aria-label="Close confirmation"
                className="
                  rounded-lg
                  p-2
                  text-text-muted
                  transition-colors
                  hover:bg-surface-container
                  hover:text-primary
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-primary
                  disabled:opacity-50
                "
              >
                <X
                  size={18}
                  aria-hidden="true"
                />
              </button>
            </div>

            {/* Dialog content */}
            <div className="mb-5 flex flex-col items-center">
              <div
                className="
                  mb-4
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-grid-line
                  bg-surface-container
                  text-primary
                "
              >
                <Trash2
                  size={22}
                  aria-hidden="true"
                />
              </div>

              <h2
                id="delete-gallery-title"
                className="
                  font-display
                  text-lg
                  font-bold
                  tracking-tight
                  text-primary
                "
              >
                Delete this photo?
              </h2>

              <p
                id="delete-gallery-description"
                className="
                  mt-2
                  font-body
                  text-sm
                  leading-6
                  text-text-muted
                  text-center
                "
              >
                This will remove the selected
                photo from{" "}
                <span className="font-semibold text-text">
                  {event.title}
                </span>.{" "}
                This action cannot be undone.
              </p>
            </div>

            {/* Photo context */}
            <div
              className="
                mb-5
                flex
                items-center
                gap-3
                border
                border-grid-line
                bg-surface-container-low
                p-3
              "
            >
              {photoToDelete.galleryPhotoUrl ? (
                <img
                  src={
                    photoToDelete.galleryPhotoUrl
                  }
                  alt=""
                  className="
                    h-14
                    w-20
                    shrink-0
                    object-cover
                  "
                />
              ) : (
                <div
                  className="
                    flex
                    h-14
                    w-20
                    shrink-0
                    items-center
                    justify-center
                    bg-surface-container
                  "
                >
                  <ImageOff
                    size={20}
                    aria-hidden="true"
                  />
                </div>
              )}

              <div className="min-w-0">
                <p
                  className="
                    font-body
                    text-xs
                    font-semibold
                    text-primary
                  "
                >
                  {photoToDelete.caption?.trim() ||
                    "Untitled gallery photo"}
                </p>

                <p
                  className="
                    mt-1
                    truncate
                    font-mono
                    text-[9px]
                    text-text-muted
                  "
                >
                  {event.title}
                </p>

              </div>
            </div>

            {/* Error stays in the dialog so the user can retry */}
            {deleteError &&
              deleteErrorId !== null && (
                <div
                  role="alert"
                  className="
                    mb-4
                    flex
                    items-start
                    gap-2
                    border
                    border-red-200
                    bg-red-50
                    p-3
                    font-body
                    text-xs
                    leading-5
                    text-status-red
                  "
                >
                  <AlertCircle
                    size={16}
                    className="mt-0.5 shrink-0"
                    aria-hidden="true"
                  />

                  {deleteError}
                </div>
              )}

            {/* Actions */}
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleDeletePhoto}
                disabled={
                  deletingPhotoId !== null
                }
                className="
                  inline-flex
                  min-h-11
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-primary
                  px-4
                  font-display
                  text-sm
                  font-semibold
                  text-white
                  transition-colors
                  hover:bg-primary-light
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-primary
                  focus-visible:ring-offset-2
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {deletingPhotoId !== null ? (
                  <>
                    <LoaderCircle
                      size={17}
                      className="animate-spin"
                      aria-hidden="true"
                    />

                    Deleting Photo...
                  </>
                ) : (
                  <>
                    <Trash2
                      size={17}
                      aria-hidden="true"
                    />

                    Confirm & Remove
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setPhotoToDelete(null);
                  setDeleteError("");
                }}
                disabled={
                  deletingPhotoId !== null
                }
                className="
                  min-h-11
                  w-full
                  rounded-lg
                  border
                  border-grid-line
                  bg-surface
                  px-4
                  font-display
                  text-sm
                  font-semibold
                  text-text
                  transition-colors
                  hover:bg-surface-container
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-primary
                  focus-visible:ring-offset-2
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                Cancel
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default EventGallery;
