import { useRef, useEffect, useState } from "react";

import {
  ArrowRight,
  CalendarDays,
  ImagePlus,
  LoaderCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import useEvents from "../../../hooks/useEvents.js";
import useFileUpload from "../../../hooks/useFileUpload.js";

const MAX_TITLE_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 300;

const EMPTY_FORM = {
  title: "",
  scheduledAt: "",
  venue: "",
  category: "",
  flyerUrl: "",
  flyerPublicId: "",
  description: "",
  ticketUrl: "",
};

const isValidUrl = (value) => {
  try {
    const normalized = /^https?:\/\//i.test(value)
      ? value
      : `https://${value}`;

    const url = new URL(normalized);

    return Boolean(url.hostname.includes("."));
  } catch {
    return false;
  }
};

const formatDateTimeLocal = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const timezoneOffset = date.getTimezoneOffset();

  return new Date(
    date.getTime() - timezoneOffset * 60_000,
  )
    .toISOString()
    .slice(0, 16);
};

const getErrorMessage = (error, fallback) => {
  if (typeof error === "string") {
    return error;
  }

  return (
    error?.response?.data?.message ??
    error?.message ??
    fallback
  );
};

const getEventFormData = (event) => ({
  title: event?.title ?? "",
  scheduledAt: formatDateTimeLocal(event?.scheduledAt),
  venue: event?.venue ?? "",
  category: event?.category ?? "",
  flyerUrl: event?.flyerUrl ?? "",
  flyerPublicId: event?.flyerPublicId ?? "",
  description: event?.description ?? "",
  ticketUrl: event?.ticketUrl ?? "",
});

const EventForm = ({
  onCancel,
  mode = "create",
  event = null,
}) => {
  const isUpdate = mode === "update";

  const {
    createEvent,
    creating,
    createError,
    updateEvent,
    updating,
    updateError,
  } = useEvents();

  const {
    uploadEventFlyer,
    uploading,
  } = useFileUpload();

  const navigate = useNavigate();

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [flyerFile, setFlyerFile] = useState(null);
  const [errors, setErrors] = useState({});

  const scheduledAtRef = useRef(null);

  const isBusy = creating || updating || uploading;

  const eventId = event?._id ?? event?.id;

  const requestError = isUpdate
    ? updateError
    : createError;

  const requestErrorMessage = requestError
    ? getErrorMessage(
        requestError,
        isUpdate
          ? "Failed to update event. Please try again."
          : "Failed to create event. Please try again.",
      )
    : "";

  useEffect(() => {
    if (isUpdate && event) {
      setFormData(getEventFormData(event));
      setFlyerFile(null);
      setErrors({});
      return;
    }

    if (!isUpdate) {
      setFormData(EMPTY_FORM);
      setFlyerFile(null);
      setErrors({});
    }
  }, [event, isUpdate]);

  const handleScheduledAtClick = () => {
    scheduledAtRef.current?.showPicker?.();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));
  };

  const handleFlyerChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrors((current) => ({
        ...current,
        flyerUrl: "Please select a JPG, PNG, or WEBP image.",
      }));

      e.target.value = "";
      return;
    }

    setErrors((current) => ({
      ...current,
      flyerUrl: "",
    }));

    try {
      const result = await uploadEventFlyer(file);

      const uploadedUrl = result?.data?.url;
      const uploadedPublicId = result?.data?.publicId;

      if (!uploadedUrl || !uploadedPublicId) {
        throw new Error(
          "The flyer upload did not return a valid URL and public ID.",
        );
      }

      setFormData((current) => ({
        ...current,
        flyerUrl: uploadedUrl,
        flyerPublicId: uploadedPublicId,
      }));

      setFlyerFile(file);
    } catch (error) {
      console.error("Failed to upload event flyer:", error);

      setFlyerFile(null);

      setErrors((current) => ({
        ...current,
        flyerUrl: getErrorMessage(
          error,
          "Failed to upload event flyer.",
        ),
      }));

      e.target.value = "";
    }
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.title.trim()) {
      nextErrors.title = "Event title is required.";
    } else if (
      formData.title.trim().length > MAX_TITLE_LENGTH
    ) {
      nextErrors.title =
        `Event title cannot exceed ${MAX_TITLE_LENGTH} characters.`;
    }

    if (!formData.scheduledAt) {
      nextErrors.scheduledAt =
        "Event date and time are required.";
    } else if (
      Number.isNaN(new Date(formData.scheduledAt).getTime())
    ) {
      nextErrors.scheduledAt =
        "Enter a valid event date and time.";
    }

    if (!formData.venue.trim()) {
      nextErrors.venue = "Event venue is required.";
    }

    if (!formData.category.trim()) {
      nextErrors.category = "Event category is required.";
    }

    if (!formData.flyerUrl.trim()) {
      nextErrors.flyerUrl = "Event flyer is required.";
    }

    if (
      !formData.flyerPublicId.trim()
    ) {
      nextErrors.flyerUrl =
        "The flyer is missing its upload reference. Please upload it again.";
    }

    if (
      formData.ticketUrl.trim() &&
      !isValidUrl(formData.ticketUrl.trim())
    ) {
      nextErrors.ticketUrl = "Enter a valid ticket URL.";
    }

    if (!formData.description.trim()) {
      nextErrors.description =
        "Event description is required.";
    } else if (
      formData.description.trim().length >
      MAX_DESCRIPTION_LENGTH
    ) {
      nextErrors.description =
        `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters.`;
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (submitEvent) => {
    submitEvent.preventDefault();

    if (isBusy) {
      return;
    }

    if (isUpdate && !eventId) {
      setErrors({
        form: "The event ID is missing. Unable to update this event.",
      });

      return;
    }

    if (!validate()) {
      return;
    }

    const payload = {
      title: formData.title.trim(),
      scheduledAt: new Date(
        formData.scheduledAt,
      ).toISOString(),
      venue: formData.venue.trim(),
      category: formData.category.trim(),
      flyerUrl: formData.flyerUrl.trim(),
      flyerPublicId: formData.flyerPublicId.trim(),
      description: formData.description.trim(),
      ticketUrl: formData.ticketUrl.trim(),
    };

    try {
      if (isUpdate) {
        const updatedEvent = await updateEvent(
          eventId,
          payload,
        );

        const updatedEventId =
          updatedEvent?._id ??
          updatedEvent?.id ??
          eventId;

        navigate(`/events/${updatedEventId}`);
        return;
      }

      const createdEvent = await createEvent(payload);

      if (createdEvent?._id || createdEvent?.id) {
        const createdEventId =
          createdEvent._id ?? createdEvent.id;

        navigate(`/events/${createdEventId}`);
        return;
      }

      setErrors({
        form:
          "The event request completed, but no event record was returned.",
      });
    } catch (error) {
      console.error(
        isUpdate
          ? "Failed to update event:"
          : "Failed to create event:",
        error,
      );
    }
  };

  return (
    <div className="border border-on-background bg-surface shadow-neo">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-grid-line bg-surface-container-low p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <CalendarDays
            size={20}
            strokeWidth={2}
            className="shrink-0 text-primary"
            aria-hidden="true"
          />

          <span className="font-mono text-mono-label font-bold uppercase text-on-background">
            {isUpdate
              ? "Event Modification Schema v1.0"
              : "Event Configuration Schema v1.0"}
          </span>
        </div>

        <span className="font-mono text-mono-tiny uppercase text-muted-slate">
          Required fields marked *
        </span>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-8 p-6 md:p-8"
      >
        {/* Title */}
        <div>
          <div className="mb-2 flex items-center justify-between gap-4">
            <label
              htmlFor="event-title"
              className="flex items-center gap-2 font-display text-headline-sm font-bold text-on-background"
            >
              Event Title
              <span className="text-status-red">*</span>
            </label>

            <span className="shrink-0 font-mono text-mono-tiny uppercase text-muted-slate">
              {formData.title.length} / {MAX_TITLE_LENGTH} chars
            </span>
          </div>

          <input
            id="event-title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            maxLength={MAX_TITLE_LENGTH}
            placeholder="e.g. D-Wave Summer Concert"
            className="input border-2 border-on-background"
            aria-invalid={Boolean(errors.title)}
            aria-describedby={
              errors.title ? "event-title-error" : undefined
            }
            disabled={isBusy}
          />

          {errors.title && (
            <p
              id="event-title-error"
              className="field-error mt-2"
            >
              {errors.title}
            </p>
          )}
        </div>

        {/* Date & Time */}
        <div>
          <label
            htmlFor="event-scheduled-at"
            className="mb-2 flex items-center gap-2 font-display text-headline-sm font-bold text-on-background"
          >
            Scheduled Date &amp; Time
            <span className="text-status-red">*</span>
          </label>

          <input
            ref={scheduledAtRef}
            id="event-scheduled-at"
            name="scheduledAt"
            type="datetime-local"
            value={formData.scheduledAt}
            onChange={handleChange}
            onClick={handleScheduledAtClick}
            className="input cursor-pointer border-2 border-on-background"
            aria-invalid={Boolean(errors.scheduledAt)}
            disabled={isBusy}
          />

          {errors.scheduledAt && (
            <p className="field-error mt-2">
              {errors.scheduledAt}
            </p>
          )}
        </div>

        {/* Venue + Category */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="event-venue"
              className="mb-2 flex items-center gap-2 font-display text-headline-sm font-bold text-on-background"
            >
              Venue
              <span className="text-status-red">*</span>
            </label>

            <input
              id="event-venue"
              name="venue"
              type="text"
              value={formData.venue}
              onChange={handleChange}
              placeholder="e.g. Landmark Event Centre"
              className="input border-2 border-on-background"
              aria-invalid={Boolean(errors.venue)}
              disabled={isBusy}
            />

            {errors.venue && (
              <p className="field-error mt-2">
                {errors.venue}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="event-category"
              className="mb-2 flex items-center gap-2 font-display text-headline-sm font-bold text-on-background"
            >
              Category
              <span className="text-status-red">*</span>
            </label>

            <input
              id="event-category"
              name="category"
              type="text"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g. Concert"
              className="input border-2 border-on-background"
              aria-invalid={Boolean(errors.category)}
              disabled={isBusy}
            />

            {errors.category && (
              <p className="field-error mt-2">
                {errors.category}
              </p>
            )}
          </div>
        </div>

        {/* Event Flyer */}
        <div>
          <div className="mb-2 flex items-center justify-between gap-4">
            <label
              htmlFor="event-flyer"
              className="flex items-center gap-2 font-display text-headline-sm font-bold text-on-background"
            >
              Event Flyer
              <span className="text-status-red">*</span>
            </label>

            <span className="font-mono text-mono-tiny uppercase text-muted-slate">
              Image required
            </span>
          </div>

          <div
            className={`
              overflow-hidden border-2
              ${
                errors.flyerUrl
                  ? "border-status-red"
                  : "border-on-background"
              }
              bg-surface
            `}
          >
            {formData.flyerUrl ? (
              <div>
                <div className="relative bg-surface-container">
                  <img
                    src={formData.flyerUrl}
                    alt="Event flyer preview"
                    className="aspect-video w-full object-contain"
                  />
                </div>

                <div className="flex flex-col gap-3 border-t border-grid-line bg-surface-container-low p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-mono text-mono-tiny font-bold uppercase text-on-background">
                      {isUpdate && !flyerFile
                        ? "Current flyer"
                        : "Flyer uploaded"}
                    </p>

                    <p className="mt-1 truncate font-body text-sm text-muted-slate">
                      {flyerFile?.name ??
                        (isUpdate
                          ? "Existing event flyer"
                          : "Flyer ready")}
                    </p>
                  </div>

                  <label
                    htmlFor="event-flyer"
                    className={`
                      shrink-0 cursor-pointer border
                      border-on-background bg-surface
                      px-4 py-2 text-center
                      font-mono text-mono-tiny
                      font-bold uppercase text-on-surface
                      transition-colors hover:bg-surface-container
                      ${
                        isBusy
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    `}
                  >
                    Replace Flyer
                  </label>
                </div>
              </div>
            ) : (
              <label
                htmlFor="event-flyer"
                className="
                  flex min-h-[220px]
                  cursor-pointer flex-col
                  items-center justify-center
                  bg-surface-container-low
                  p-6 text-center
                  transition-colors
                  hover:bg-surface-container
                "
              >
                <ImagePlus
                  size={40}
                  strokeWidth={1.75}
                  className="mb-3 text-primary"
                  aria-hidden="true"
                />

                <span className="font-display font-bold text-on-background">
                  Upload Event Flyer
                </span>

                <span className="mt-1 font-body text-sm text-muted-slate">
                  Select an image from your device
                </span>

                <span className="mt-3 font-mono text-mono-tiny uppercase text-muted-slate">
                  JPG, PNG, WEBP
                </span>
              </label>
            )}

            <input
              id="event-flyer"
              name="flyerUrl"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFlyerChange}
              disabled={isBusy}
              className="sr-only"
            />
          </div>

          {uploading && (
            <p
              role="status"
              className="mt-2 flex items-center gap-2 font-mono text-mono-tiny uppercase text-muted-slate"
            >
              <LoaderCircle
                size={16}
                className="animate-spin"
                aria-hidden="true"
              />

              Uploading flyer...
            </p>
          )}

          {errors.flyerUrl && (
            <p className="field-error mt-2">
              {errors.flyerUrl}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <div className="mb-2 flex items-center justify-between gap-4">
            <label
              htmlFor="event-description"
              className="flex items-center gap-2 font-display text-headline-sm font-bold text-on-background"
            >
              Description
              <span className="text-status-red">*</span>
            </label>

            <span className="shrink-0 font-mono text-mono-tiny uppercase text-muted-slate">
              {formData.description.length} / {MAX_DESCRIPTION_LENGTH} chars
            </span>
          </div>

          <textarea
            id="event-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            maxLength={MAX_DESCRIPTION_LENGTH}
            rows={5}
            placeholder="Describe the event..."
            className="input min-h-[140px] resize-y border-2 border-on-background"
            aria-invalid={Boolean(errors.description)}
            disabled={isBusy}
          />

          {errors.description && (
            <p className="field-error mt-2">
              {errors.description}
            </p>
          )}
        </div>

        {/* Ticket URL */}
        <div>
          <div className="mb-2 flex items-center justify-between gap-4">
            <label
              htmlFor="event-ticket-url"
              className="font-display text-headline-sm font-bold text-on-background"
            >
              Ticket URL
            </label>

            <span className="font-mono text-mono-tiny uppercase text-muted-slate">
              Optional
            </span>
          </div>

          <input
            id="event-ticket-url"
            name="ticketUrl"
            type="text"
            value={formData.ticketUrl}
            onChange={handleChange}
            placeholder="https://..."
            className="input border-2 border-on-background"
            aria-invalid={Boolean(errors.ticketUrl)}
            disabled={isBusy}
          />

          {errors.ticketUrl && (
            <p className="field-error mt-2">
              {errors.ticketUrl}
            </p>
          )}
        </div>

        {/* Request / Form Errors */}
        {(requestErrorMessage || errors.form) && (
          <div
            role="alert"
            className="border-2 border-status-red bg-red-50 p-4 text-sm font-medium text-status-red"
          >
            {errors.form || requestErrorMessage}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col items-center justify-between gap-4 border-t-2 border-on-background pt-6 sm:flex-row">
          <button
            type="button"
            onClick={onCancel}
            disabled={isBusy}
            className="w-full border border-on-background bg-surface px-6 py-3 font-mono text-mono-label uppercase tracking-wider text-on-surface transition-colors hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isBusy}
            className="flex w-full items-center justify-center gap-2 border-2 border-on-background bg-primary-container px-8 py-3 font-mono text-mono-label font-bold uppercase tracking-wider text-white shadow-neo transition-all hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isBusy && (
              <LoaderCircle
                size={18}
                className="animate-spin"
                aria-hidden="true"
              />
            )}

            <span>
              {uploading
                ? "Uploading Flyer..."
                : creating
                  ? "Creating Event..."
                  : updating
                    ? "Saving Changes..."
                    : isUpdate
                      ? "Save Changes"
                      : "Create Event"}
            </span>

            {!isBusy && (
              <ArrowRight
                size={18}
                strokeWidth={2}
                aria-hidden="true"
              />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
