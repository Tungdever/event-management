import React, { useState } from "react";
import EventForm from "./EventForm";
import AddTicket from "../Ticket/AddTicket";
import EventPublishing from "./EventPublishing";

const CRUDEvent = () => {
  const [selectedStep, setSelectedStep] = useState("build");
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
    publishTime: "now",
    refunds: "yes",
    validityDays: 7,
    uploadedImages: [],
    overviewContent: { text: "", media: [] },
    tickets: [],
    segment: [],
  });
  const uploadFilesToCloudinary = async (files) => {
    if (!files || (Array.isArray(files) && files.length === 0)) return [];
  
    const uploadedIds = [];
    const fileList = Array.isArray(files)
      ? files.map((item) => (typeof item === "object" && item.url ? item.url : item))
      : [typeof files === "object" && files.url ? files.url : files];
  
    for (const file of fileList) {
      try {
        if (typeof file === "string" && file.startsWith("http")) {
          uploadedIds.push(file);
          continue;
        }
  
        let blob;
        if (typeof file === "string" && file.startsWith("blob:")) {
          const response = await fetch(file);
          if (!response.ok) throw new Error(`Failed to fetch blob: ${file}`);
          blob = await response.blob();
        } else if (file instanceof File || file instanceof Blob) {
          blob = file;
        } else {
          console.warn("Invalid file type, skipping:", file);
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
          throw new Error(`Upload failed: ${errorText}`);
        }
  
        const result = await response.text();
        const publicId = result;
        if (!publicId)
          throw new Error("Invalid public_id in response: " + result);
  
        uploadedIds.push(publicId);
      } catch (error) {
        console.error("Error uploading file:", file, error);
        uploadedIds.push(null);
      }
    }
  
    return uploadedIds.filter((id) => id !== null);
  };

  const handlePublish = async () => {
    console.log("Publishing event:", event);
  
    try {
      const isFile = (item) =>
        item instanceof File ||
        item instanceof Blob ||
        (typeof item === "string" && item.startsWith("blob:"));
  
      
      const existingImageIds =
        event.uploadedImages?.filter((item) => typeof item === "string" && item.startsWith("http")) || [];
      const newImages = event.uploadedImages?.filter(isFile) || [];
      const newImageIds = newImages.length > 0 ? await uploadFilesToCloudinary(newImages) : [];
      const uploadedImageIds = [...existingImageIds, ...newImageIds];
  
      const existingMediaIds =
        event.overviewContent?.media
          ?.filter((item) => typeof item === "object" && item.url && item.url.startsWith("http"))
          .map((item) => item.url) || [];
      const newMedia = event.overviewContent?.media?.filter((item) =>
        isFile(item) || (typeof item === "object" && isFile(item.url))
      ) || [];
      const newMediaIds = newMedia.length > 0 ? await uploadFilesToCloudinary(newMedia) : [];
      const uploadedMediaIds = [...existingMediaIds, ...newMediaIds];
  
      const dataEvent = {
        eventName: event.eventName || "",
        eventDesc: event.eventDesc || "",
        eventType: event.eventType || "",
        eventHost: event.eventHost || "",
        eventStatus: event.eventStatus || "public",
        eventStart:
          event.eventLocation.date && event.eventLocation.startTime
            ? `${event.eventLocation.date}T${event.eventLocation.startTime}:00`
            : "",
        eventEnd:
          event.eventLocation.date && event.eventLocation.endTime
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
        publishTime: event.publishTime || "now",
        refunds: event.refunds || "no",
        validityDays: event.validityDays || 7,
        eventImages: uploadedImageIds,
        textContent: event.overviewContent?.text || "",
        mediaContent: uploadedMediaIds,
      };
  
      const eventResponse = await fetch("http://localhost:8080/api/events/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataEvent),
      });
  
      if (!eventResponse.ok) {
        const errorText = await eventResponse.text();
        throw new Error(`Failed to save event: ${errorText}`);
      }
  
      const eventResult = await eventResponse.json();
      const eventId =  eventResult;
      //console.log("Event saved with ID:", eventId);
  
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
  
          //console.log("Segment API:", segmentapi);
          const segmentResponse = await fetch(`http://localhost:8080/api/segment/${eventId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(segmentapi),
          });
  
          if (!segmentResponse.ok) {
            const errorText = await segmentResponse.text();
            throw new Error(`Failed to save segment: ${errorText}`);
          }
        }
        //console.log("All segments saved for event:", eventId);
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
  
          //console.log("Ticket API:", ticketapi);
          const ticketResponse = await fetch(`http://localhost:8080/api/ticket/${eventId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(ticketapi),
          });
  
          if (!ticketResponse.ok) {
            const errorText = await ticketResponse.text();
            throw new Error(`Failed to save tickets: ${errorText}`);
          }
        }
        //console.log("All tickets saved for event:", eventId);
      }
  
      const updatedEvent = {
        ...event,
        uploadedImages: uploadedImageIds,
        overviewContent: {
          ...event.overviewContent,
          media: uploadedMediaIds.map((id, index) => ({
            type:
              (newMedia[index] || event.overviewContent?.media[index])?.type || "image",
            url: id,
          })),
        },
      };
      setEvent(updatedEvent);
  
      alert(
        `Event published successfully!\nUploaded Images: ${uploadedImageIds.length}, Media: ${uploadedMediaIds.length}, Event ID: ${eventId}`
      );
    } catch (error) {
      console.error("Failed to publish event:", error);
      alert(`Failed to process event: ${error.message}`);
    }
  };
  const handleTicketsUpdate = (updatedTickets) => {
    setEvent((prevEvent) => ({
      ...prevEvent,
      tickets: updatedTickets,
    }));
  };
  const renderStepComponent = () => {
    switch (selectedStep) {
      case "build":
        return (
          <EventForm
            event={event}
            setEvent={setEvent}
            onNext={() => setSelectedStep("tickets")}
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
        return <EventForm event={event} setEvent={setEvent} />;
    }
  };

  return (
    <div className="bg-gray-50 flex flex-col lg:flex-row justify-center items-start lg:items-stretch p-6 space-y-4 lg:space-y-0 lg:space-x-2 min-h-screen">
      <aside className="bg-white w-full lg:w-1/4 p-4 shadow-sm">
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <h2 className="text-lg font-semibold">
            {event.eventName || "Untitled Event"}
          </h2>
          <div className="flex items-center text-gray-500 mt-2">
            <i className="far fa-calendar-alt mr-2"></i>
            <span>
              {event.eventLocation.date && event.eventLocation.startTime
                ? `${event.eventLocation.date}, ${event.eventLocation.startTime}`
                : "Date and time not set"}
            </span>
          </div>
          <div className="flex items-center mt-4">
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2">
              Draft <i className="fas fa-caret-down ml-1"></i>
            </button>
            <a href="#" className="text-blue-600">
              Preview <i className="fas fa-external-link-alt"></i>
            </a>
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
                onChange={() => setSelectedStep(step)}
                className="w-4 h-4 border-2 border-orange-500 accent-red-500"
              />
              <span>
                {step === "build" && "Build event page"}
                {step === "tickets" && "Add tickets"}
                {step === "publish" && "Publish"}
              </span>
            </label>
          ))}
        </div>
      </aside>
      <div className="px-2 w-full lg:w-3/4">{renderStepComponent()}</div>
    </div>
  );
};

export default CRUDEvent;
