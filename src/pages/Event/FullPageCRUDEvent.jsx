import React, { useState, useEffect } from "react";
import EventForm from "./CreateEvent";
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
    tickets: [
      {
        eventId: "",
        ticketId: "",
        ticketName: "",
        ticketType: "Paid",
        price: "",
        quantity: "",
        startTime: "",
        endTime: "",
      },
    ],
    segment: [
      {
        segmentTitle: "",
        speaker: {
          speakerImage: "",
          speakerName: "",
          speakerDesc: "",
        },

        eventID: "",
        segmentDesc: "",
        startTime: "",
        endTime: "",
      },
    ],
  });

  const uploadFilesToCloudinary = async (files) => {
    const uploadedIds = [];
    const fileList = files.map((item) =>
      typeof item === "object" && item.url ? item.url : item
    );

    for (const file of fileList) {
      try {
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

        const response = await fetch(
          "http://localhost:8080/api/storage/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Upload failed: ${errorText}`);
        }

        const result = await response.text();
        const publicId = result[1];
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

  const saveEventToDatabase = async (eventData) => {
    const dataEvent = {
      eventName: eventData.eventName || "",
      eventDesc: eventData.eventDesc || "",
      eventType: eventData.eventType || "",
      eventHost: eventData.eventHost || "",
      eventStatus: eventData.eventStatus || "public",
      eventStart:
        eventData.eventLocation.date && eventData.eventLocation.startTime
          ? `${eventData.eventLocation.date} ${eventData.eventLocation.startTime}`
          : "",
      eventEnd:
        eventData.eventLocation.date && eventData.eventLocation.endTime
          ? `${eventData.eventLocation.date} ${eventData.eventLocation.endTime}`
          : "",
      eventLocation:
        eventData.eventLocation.locationType === "online"
          ? "Online"
          : `${eventData.eventLocation.venueName || ""} ${
              eventData.eventLocation.address || ""
            } ${eventData.eventLocation.city || ""}`.trim(),
      tags: eventData.tags.join("|"),
      eventVisibility: eventData.eventVisibility || "public",
      publishTime: eventData.publishTime || "now",
      refunds: eventData.refunds || "no",
      validityDays: eventData.validityDays || 7,
      eventImages: eventData.uploadedImages || [],
      textContent: eventData.overviewContent.text || "",
      mediaContent:
        eventData.overviewContent.media.map((item) => item.url) || [],
    };
  
    try {
      // Step 1: Save the event to the database
      const eventResponse = await fetch("http://localhost:8080/api/events/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataEvent),
      });
  
      if (!eventResponse.ok) {
        const errorText = await eventResponse.text();
        throw new Error(`Failed to save event: ${errorText}`);
      }
  
      const eventResult = await eventResponse.json();
      const eventId = eventResult.eventId; // Assuming the API returns eventId
      console.log("Event saved to database with ID:", eventId);
  
      // Step 2: Save segments for the event
      if (eventData.segment && eventData.segment.length > 0) {
        const segmentData = eventData.segment.map((seg) => ({
          ...seg,
          eventID: eventId, // Assign the retrieved eventId
        }));
  
        const segmentResponse = await fetch(
          `http://localhost:8080/api/segment/${eventId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(segmentData),
          }
        );
  
        if (!segmentResponse.ok) {
          const errorText = await segmentResponse.text();
          throw new Error(`Failed to save segments: ${errorText}`);
        }
  
        const segmentResult = await segmentResponse.json();
        console.log("Segments saved:", segmentResult);
      }
  
      // Step 3: Save tickets for the event
      if (eventData.tickets && eventData.tickets.length > 0) {
        const ticketData = eventData.tickets.map((ticket) => ({
          ...ticket,
          eventId: eventId, // Assign the retrieved eventId
        }));
  
        const ticketResponse = await fetch(
          `http://localhost:8080/api/ticket/${eventId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(ticketData),
          }
        );
  
        if (!ticketResponse.ok) {
          const errorText = await ticketResponse.text();
          throw new Error(`Failed to save tickets: ${errorText}`);
        }
  
        const ticketResult = await ticketResponse.json();
        console.log("Tickets saved:", ticketResult);
      }
  
      return { eventId, ...eventResult }; 
    } catch (error) {
      console.error("Error saving event to database:", error);
      throw error;
    }
  };

  const handlePublish = async () => {
    try {
      // Step 1: Upload files to Cloudinary
      const uploadedImageIds = await uploadFilesToCloudinary(event.uploadedImages);
      const uploadedMediaIds = await uploadFilesToCloudinary(event.overviewContent.media);
  
      if (uploadedImageIds.length === 0 && uploadedMediaIds.length === 0) {
        throw new Error("No files were uploaded successfully.");
      }
  
      // Step 2: Update event with public_ids from Cloudinary
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
  
      // Step 3: Save event, segments, and tickets to database
      const result = await saveEventToDatabase(updatedEvent);
      const eventId = result.eventId;
  
      console.log("Event published and saved with ID:", eventId);
      alert(
        `Event published successfully!\nEvent ID: ${eventId}\nUploaded Images: ${uploadedImageIds.length}, Media: ${uploadedMediaIds.length}`
      );
    } catch (error) {
      console.error("Failed to publish event:", error);
      alert(`Failed to process event: ${error.message}`);
    }
  };
// Hàm nhận dữ liệu từ component con và cập nhật state
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
          <AddTicket ticketData={event.tickets} onTicketsUpdate={handleTicketsUpdate} 
          eventId={1} onNext={() => setSelectedStep("publish")} />
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
