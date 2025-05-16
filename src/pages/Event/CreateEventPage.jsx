import React, { useState,useEffect } from "react";
import EventForm from "./EventForm";
import AddTicket from "../Ticket/AddTicket";
import EventPublishing from "./EventPublishing";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loading";
import { useAuth } from "../Auth/AuthProvider";

import Swal from 'sweetalert2';

const CRUDEvent = () => {
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
  },[])
  const uploadFilesToCloudinary = async (files) => {
    if (!files || (Array.isArray(files) && files.length === 0)) return [];

    const uploadPromises = files.map(async (file) => {
      try {
        if (typeof file === "string" && file.startsWith("http")) {
          return file;
        }

        if (!(file instanceof File)) {
          Swal.fire({
            icon: 'warning',
            title: 'Cảnh báo',
            text: 'File không hợp lệ!',
          });
          return null;
        }

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("http://localhost:8080/api/storage/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Tải lên thất bại: ${errorText}`);
        }

        const publicId = await response.text();
        if (!publicId) throw new Error("Không nhận được public_id");
        return publicId;
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: `Lỗi khi tải file: ${error.message}`,
        });
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    return results.filter((id) => id !== null);
  };

  const handlePublish = async () => {
    setIsLoading(true);
    try {
     // Xử lý uploadedImages
    const existingImageIds = event.uploadedImages
      .filter((item) => typeof item === "string" && item.startsWith("http")) || [];
    const newImages = event.uploadedImages
      .filter((item) => item instanceof File) || [];
    const newImageIds = await uploadFilesToCloudinary(newImages);
    const uploadedImageIds = [...existingImageIds, ...newImageIds];

    // Xử lý overviewContent.media
    const existingMediaIds = event.overviewContent.media
      .filter((item) => typeof item === "object" && item.url?.startsWith("http"))
      .map((item) => item.url) || [];
    const newMediaFiles = event.overviewContent.media
      .filter((item) => item.file instanceof File)
      .map((item) => item.file) || []; // Lấy file gốc
    const newMediaIds = await uploadFilesToCloudinary(newMediaFiles);
    const uploadedMediaIds = [...existingMediaIds, ...newMediaIds];

    const dataEvent = {
      eventName: event.eventName || "",
      eventDesc: event.eventDesc || "",
      eventType: event.eventType || "",
      eventHost: event.eventHost || "",
      eventStatus: event.eventStatus || "public",
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
      },
      tags: event.tags?.join("|") || "",
      eventVisibility: event.eventVisibility || "public",
      publishTime: event.publishTime || new Date().toISOString(),
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

     

      if (event.segment?.length > 0) {
        for (const segment of event.segment) {
          const uploadedSpeakerId = segment?.speaker?.speakerImage
            ? (await uploadFilesToCloudinary([segment.speaker.speakerImage]))[0]
            : null;
          const segmentapi = {
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
      Swal.fire ({
        Icon: 'Success',
        Title: 'Success',
        Text: `The event is successfully published! ID: $ {Eventid}`,
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
    }

    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value || (typeof value === "string" && value.trim() === "")) {
        return { isValid: false, message: `Vui lòng điền trường ${key}.` };
      }
    }

    return { isValid: true, message: "" };
  };

  const handleNext = () => {
    const validation = validateEventForm(event);
    if (!validation.isValid) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
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
        title: 'Lỗi',
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
          />
        );
      case "tickets":
        return (
          <AddTicket
            ticketData={event.tickets}
            onTicketsUpdate={handleTicketsUpdate}
            eventId={1}
            onNext={() => setSelectedStep("publish")}
          />
        );
      case "publish":
        return (
          <EventPublishing
            event={event}
            setEvent={setEvent}
            onPublish={handlePublish}
          />
        );
      default:
        return <EventForm event={event} setEvent={setEvent} validateEventForm={validateEventForm} />;
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="bg-gray-50 flex flex-col lg:flex-row justify-center items-start lg:items-stretch p-6 space-y-4 lg:space-y-0 lg:space-x-2 min-h-screen">
          <aside className="bg-white w-full lg:w-1/4 p-4 shadow-sm">
            <div className="bg-white p-4 rounded-lg shadow-md mb-4">
              <h2 className="text-lg font-semibold">
                {event.eventName || "The event has no title"}
              </h2>
              <div className="flex items-center text-gray-500 mt-2">
                <i className="far fa-calendar-alt mr-2"></i>
                <span>
                  {event.eventLocation.date && event.eventLocation.startTime
                    ? `${event.eventLocation.date}, ${event.eventLocation.startTime}`
                    : "Not yet established date and time"}
                </span>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Steps</h3>
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
                  <span>
                    {step === "build" && "Build event"}
                    {step === "tickets" && "Add ticket"}
                    {step === "publish" && "Publish"}
                  </span>
                </label>
              ))}
            </div>
          </aside>
          <div className="px-2 w-full lg:w-3/4">{renderStepComponent()}</div>
        </div>
      )}
    </>
  );
};

export default CRUDEvent;