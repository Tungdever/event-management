import React, { useState, useEffect } from "react";
import EventForm from "./EventForm";
import AddTicket from "../Ticket/AddTicket";
import EventPublishing from "./EventPublishing";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loading";
import { useAuth } from "../Auth/AuthProvider";
import Swal from 'sweetalert2';
import { useTranslation } from "react-i18next";
import Footer from "../../components/Footer";

const CRUDEvent = () => {
  const { t } = useTranslation();
  const [selectedStep, setSelectedStep] = useState("build");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState({
    eventName: "",
    eventDesc: "",
    eventType: "",
    eventHost: "",
    eventStatus: "",
    eventStart: "",
    eventEnd: "",
    eventLocation: {
      date: "",
      startTime: "",
      endTime: "",
      locationType: "online",
      venueName: "",
      address: "",
      city: "",
      meetingUrl: "",
    },
    tags: [],
    eventVisibility: "public",
    publishTime: new Date().toISOString(),
    refunds: "yes",
    validityDays: 7,
    uploadedImages: [],
    overviewContent: { text: "", media: [] },
    tickets: [],
    segment: [],
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const uploadFilesToCloudinary = async (files) => {
    if (!files || (Array.isArray(files) && files.length === 0)) return [];

    const uploadedIds = [];
    const fileList = Array.isArray(files)
      ? files.map((item) => (typeof item === "object" && item.file ? item.file : item))
      : [typeof files === "object" && files.file ? files.file : files];

    for (const file of fileList) {
      try {
        let blob;
        if (file instanceof Blob || file instanceof File) {
          blob = file;
        } else if (typeof file === "string" && file.startsWith("http")) {
          uploadedIds.push(file);
          continue;
        } else if (typeof file === "string" && file.startsWith("blob:")) {
          const response = await fetch(file);
          if (!response.ok) throw new Error(t("createEventPage.errors.uploadFailed", { message: `Failed to fetch blob: ${file}` }));
          blob = await response.blob();
        } else {
          Swal.fire({
            icon: "warning",
            title: t("createEventPage.errors.invalidFile"),
            text: t("createEventPage.errors.invalidFile"),
          });
          continue;
        }

        // Kiểm tra xem file có phải là hình ảnh không
        if (!blob.type.startsWith('image/')) {
          Swal.fire({
            icon: "warning",
            title: t("createEventPage.errors.invalidFileType"),
            text: t("createEventPage.errors.invalidFileType"),
          });
          continue;
        }
        if (blob.size > 10 * 1024 * 1024) {
          Swal.fire({
            icon: "warning",
            title: t("createEventPage.errors.fileSizeTooLarge"),
            text: t("createEventPage.errors.fileSizeTooLarge"),
          });
          continue;
        }

        const formData = new FormData();
        formData.append("file", blob);

        const response = await fetch("http://localhost:8080/api/storage/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(t("createEventPage.errors.uploadFailed", { message: errorText }));
        }

        const publicId = await response.text();
        if (!publicId) throw new Error(t("createEventPage.errors.noPublicId"));
        uploadedIds.push(publicId);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: t("createEventPage.errors.uploadFailed", { message: "" }),
          text: t("createEventPage.errors.uploadFailed", { message: error.message }),
        });
      }
    }

    return uploadedIds.filter((id) => id !== null);
  };

  const handlePublish = async (eventStatus = "Draft") => {
    setIsLoading(true);
    try {
      const existingImageIds = event.uploadedImages
        .filter((item) => typeof item === "string" && item.startsWith("http")) || [];
      const newImages = event.uploadedImages
        .filter((item) => item instanceof File || item instanceof Blob) || [];
      const newImageIds = await uploadFilesToCloudinary(newImages);
      const uploadedImageIds = [...existingImageIds, ...newImageIds];

      const existingMediaIds = event.overviewContent.media
        .filter((item) => typeof item === "object" && item.url?.startsWith("http"))
        .map((item) => item.url) || [];
      const newMediaFiles = event.overviewContent.media
        .filter((item) => item.file instanceof File || item.file instanceof Blob)
        .map((item) => item.file) || [];
      const newMediaIds = await uploadFilesToCloudinary(newMediaFiles);
      const uploadedMediaIds = [...existingMediaIds, ...newMediaIds];

      const segmentData = [];
      if (event.segment?.length > 0) {
        for (const segment of event.segment) {
          const uploadedSpeakerId = segment?.speaker?.speakerImage
            ? (await uploadFilesToCloudinary([segment.speaker.speakerImage]))[0]
            : null;
          segmentData.push({
            segmentTitle: segment.segmentTitle || "",
            speaker: segment.speaker
              ? {
                  speakerImage: uploadedSpeakerId || "",
                  speakerName: segment.speaker.speakerName || "",
                  speakerDesc: segment.speaker.speakerDesc || "",
                }
              : null,
            segmentDesc: segment.segmentDesc || "",
            startTime: `${event.eventLocation.date}T${segment.startTime || "00:00"}:00`,
            endTime: `${event.eventLocation.date}T${segment.endTime || "00:00"}:00`,
          });
        }
      }

      const dataEvent = {
        eventName: event.eventName || "",
        eventDesc: event.eventDesc || "",
        eventTypeId: event.eventType || "",
        eventHost: event.eventHost || "",
        eventStatus: eventStatus,
        eventStart: event.eventLocation.date && event.eventLocation.startTime
          ? `${event.eventLocation.date}T${event.eventLocation.startTime}:00`
          : "",
        eventEnd: event.eventLocation.date && event.eventLocation.endTime
          ? `${event.eventLocation.date}T${event.eventLocation.endTime}:00`
          : "",
        eventLocation: {
          locationType: event.eventLocation.locationType || "online",
          venueName: event.eventLocation.venueName || "",
          venueSlug: event.eventLocation.venueSlug || "",
          address: event.eventLocation.address || "",
          city: event.eventLocation.city || "",
          meetingUrl: event.eventLocation.meetingUrl || "",
        },
        tags: event.tags?.join("|") || "",
        eventVisibility: event.eventVisibility || "public",
        publishTime: eventStatus === "public" ? new Date().toISOString() : null,
        refunds: event.refunds || "no",
        validityDays: event.validityDays || 7,
        eventImages: uploadedImageIds,
        textContent: event.overviewContent?.text || "",
        mediaContent: uploadedMediaIds,
        userId: user.userId,
      };

      console.log("Data sent to API:", dataEvent);
      const eventResponse = await fetch("http://localhost:8080/api/events/create", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: JSON.stringify(dataEvent),
      });

      if (!eventResponse.ok) {
        const errorText = await eventResponse.text();
        throw new Error(`Lưu sự kiện thất bại: ${errorText}`);
      }

      const responseData = await eventResponse.json();
      const eventId = responseData.data.eventId || responseData;

      if (segmentData.length > 0) {
        for (const segment of segmentData) {
          const segmentapi = {
            ...segment,
            eventID: eventId,
          };

          const segmentResponse = await fetch(`http://localhost:8080/api/segment/${eventId}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            method: "POST",
            body: JSON.stringify(segmentapi),
          });

          if (!segmentResponse.ok) {
            const errorText = await segmentResponse.text();
            throw new Error(`Lưu segment thất bại: ${errorText}`);
          }
        }
      }

      if (event.tickets?.length > 0) {
        for (const ticketData of event.tickets) {
          const ticketapi = {
            ticketName: ticketData.ticketName || "",
            ticketType: ticketData.ticketType || "",
            price: ticketData.price || 0,
            quantity: ticketData.quantity || 0,
            startTime: ticketData.startTime || "",
            endTime: ticketData.endTime || "",
          };

          const ticketResponse = await fetch(`http://localhost:8080/api/ticket/${eventId}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            method: "POST",
            body: JSON.stringify(ticketapi),
          });

          if (!ticketResponse.ok) {
            const errorText = await ticketResponse.text();
            throw new Error(`Lưu ticket thất bại: ${errorText}`);
          }
        }
      }

      const updatedEvent = {
        ...event,
        eventStatus: eventStatus,
        uploadedImages: uploadedImageIds,
        overviewContent: {
          ...event.overviewContent,
          media: uploadedMediaIds.map((id, index) => ({
            type: event.overviewContent.media[index]?.type || "image",
            url: id,
          })),
        },
      };

      setEvent(updatedEvent);
      setIsLoading(false);
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: `Sự kiện đã được ${eventStatus === "public" ? "xuất bản" : "lưu dưới dạng bản nháp"} thành công!`,
      });
      setTimeout(() => navigate('/'), 300);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: `Lỗi khi xử lý sự kiện: ${error.message}`,
      });
      setIsLoading(false);
    }
  };

  const handleTicketsUpdate = (updatedTickets) => {
    setEvent((prevEvent) => ({
      ...prevEvent,
      tickets: updatedTickets,
    }));
  };

  const validateEventForm = (event) => {
    const requiredFields = {
      eventName: event.eventName,
      eventDesc: event.eventDesc,
      date: event.eventLocation.date,
      startTime: event.eventLocation.startTime,
      endTime: event.eventLocation.endTime,
      overviewText: event.overviewContent.text,
    };

    if (event.eventLocation.locationType === "venue") {
      requiredFields.venueName = event.eventLocation.venueName;
      requiredFields.address = event.eventLocation.address;
      requiredFields.city = event.eventLocation.city;
    } else if (event.eventLocation.locationType === "online") {
      requiredFields.meetingUrl = event.eventLocation.meetingUrl;
    }

    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value || (typeof value === "string" && value.trim() === "")) {
        return {
          isValid: false,
          message: t("createEventPage.errors.requiredField", {
            field: t(`createEventPage.fields.${key}`),
          }),
        };
      }
    }

    return { isValid: true, message: "" };
  };

  const handleNext = () => {
    const validation = validateEventForm(event);
    if (!validation.isValid) {
      Swal.fire({
        icon: 'error',
        title: t("createEventPage.errors.processingError", { message: "" }),
        text: validation.message,
      });
      return;
    }
    setSelectedStep("tickets");
  };

  const handleStepChange = (step) => {
    if (step === "build") {
      setSelectedStep(step);
      return;
    }
    const validation = validateEventForm(event);
    if (!validation.isValid) {
      Swal.fire({
        icon: 'error',
        title: t("createEventPage.errors.processingError", { message: "" }),
        text: validation.message,
      });
      return;
    }
    setSelectedStep(step);
  };

  const renderStepComponent = () => {
    switch (selectedStep) {
      case "build":
        return (
          <EventForm
            event={event}
            setEvent={setEvent}
            onNext={handleNext}
            validateEventForm={validateEventForm}
            t={t}
          />
        );
      case "tickets":
        return (
          <AddTicket
            ticketData={event.tickets}
            onTicketsUpdate={handleTicketsUpdate}
            eventId={1}
            eventStart={
              event.eventLocation.date && event.eventLocation.startTime
                ? `${event.eventLocation.date}T${event.eventLocation.startTime}:00`
                : ""
            }
            eventEnd={
              event.eventLocation.date && event.eventLocation.endTime
                ? `${event.eventLocation.date}T${event.eventLocation.endTime}:00`
                : ""
            }
            onNext={() => setSelectedStep("publish")}
            t={t}
          />
        );
      case "publish":
        return (
          <EventPublishing
            event={event}
            setEvent={setEvent}
            onPublish={handlePublish}
            t={t}
          />
        );
      default:
        return (
          <EventForm
            event={event}
            setEvent={setEvent}
            validateEventForm={validateEventForm}
            t={t}
          />
        );
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col items-start justify-center min-h-screen p-6 space-y-4 bg-gray-50 lg:flex-row lg:items-stretch lg:space-y-0 lg:space-x-2">
          <aside className="w-full p-4 bg-white shadow-sm lg:w-1/4">
            <div className="p-4 mb-4 bg-white rounded-lg shadow-md">
              <h2 className="text-lg font-semibold">
                {event.eventName || t("createEventPage.noTitle")}
              </h2>
              <div className="flex items-center mt-2 text-gray-500">
                <i className="mr-2 far fa-calendar-alt"></i>
                <span>
                  {event.eventLocation.date && event.eventLocation.startTime
                    ? `${event.eventLocation.date}, ${event.eventLocation.startTime}`
                    : t("createEventPage.noDateTime")}
                </span>
              </div>
              {event.eventLocation.locationType === "online" && event.eventLocation.meetingUrl && (
                <div className="mt-2">
                  <a
                    href={event.eventLocation.meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {t("createEventPage.meetingLink", { link: event.eventLocation.meetingUrl })}
                  </a>
                </div>
              )}
            </div>
            <h3 className="mb-2 text-lg font-semibold">{t("createEventPage.stepsTitle")}</h3>
            <div className="space-y-2">
              {["build", "tickets", "publish"].map((step) => (
                <label
                  key={step}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="eventStep"
                    value={step}
                    checked={selectedStep === step}
                    onChange={() => handleStepChange(step)}
                    className="w-4 h-4 border-2 border-orange-500 accent-red-500"
                  />
                  <span>{t(`createEventPage.steps.${step}`)}</span>
                </label>
              ))}
            </div>
          </aside>
          <div className="w-full px-2 lg:w-3/4">{renderStepComponent()}</div>
        </div>
      )}
    </>
  );
};

export default CRUDEvent;