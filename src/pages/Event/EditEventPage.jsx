import React, { useState, useEffect } from "react";
import EventForm from "./EventForm";
import AddTicket from "../Ticket/AddTicket";
import EventPublishing from "./EventPublishing";
import {
  useLocation,
} from "react-router-dom";
const EditEvent = () => {
  const location = useLocation();
  const eventId = location.state?.eventId || undefined;
  const token = localStorage.getItem("token");
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

  
  useEffect(() => {
    if (eventId) {
      fetchEventData(eventId);
    }
  }, [eventId]);

  const fetchEventData = async (id) => {
    try {
      
      const response = await fetch(`http://localhost:8080/api/events/edit/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
      },
    });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch event data: ${response.status} - ${errorText}`);
      }
      const data = await response.json();
     
      if (!data || !data.event) {
        throw new Error("Invalid event data received");
      }
  
      const transformedEvent = {
        eventName: data.event.eventName || "",
        eventDesc: data.event.eventDesc || "",
        eventType: data.event.eventType || "",
        eventHost: data.event.eventHost || "",
        eventStatus: data.event.eventStatus || "",
        eventStart: data.event.eventStart || "",
        eventEnd: data.event.eventEnd || "",
        eventLocation: {
          date: data.event.eventStart?.split("T")[0] || "",
          startTime: data.event.eventStart?.split("T")[1]?.slice(0, 5) || "",
          endTime: data.event.eventEnd?.split("T")[1]?.slice(0, 5) || "",
          locationType: data.event.eventLocation?.locationType || "venue",
          venueName: data.event.eventLocation?.venueName || "",
          venueSlug: data.event.eventLocation?.venueSlug || "",
          address: data.event.eventLocation?.address || "",
          city: data.event.eventLocation?.city || "",
        },
        tags: data.event.tags ? data.event.tags.split("|") : [],
        eventVisibility: data.event.eventVisibility || "public",
        publishTime: data.event.publishTime || "now",
        refunds: data.event.refunds || "yes",
        validityDays: data.event.validityDays || 7,
        uploadedImages: data.event.eventImages || [],
        overviewContent: {
          text: data.event.textContent || "",
          media: data.event.mediaContent?.map((url) => ({ type: "image", url })) || [],
        },
        tickets: data.ticket?.map((ticket) => ({
          ticketId: ticket.ticketId || null,
          ticketName: ticket.ticketName || "",
          ticketType: ticket.ticketType || "",
          price: ticket.price || 0,
          quantity: ticket.quantity || 0,
          startTime: ticket.startTime || "",
          endTime: ticket.endTime || "",
        })) || [],
        segment: data.segment?.map((seg) => ({
          segmentId: seg.segmentId || null,
          segmentTitle: seg.segmentTitle || "",
          speaker: seg.speaker
            ? {
                speakerId: seg.speaker.speakerId || null,
                speakerImage: seg.speaker.speakerImage || "",
                speakerName: seg.speaker.speakerName || "",
                speakerDesc: seg.speaker.speakerDesc || "",
              }
            : null,
          segmentDesc: seg.segmentDesc || "",
          startTime: seg.startTime?.split("T")[1]?.slice(0, 5) || "",
          endTime: seg.endTime?.split("T")[1]?.slice(0, 5) || "",
        })) || [],
      };
  
      setEvent(transformedEvent);
    } catch (error) {
      console.error("Error fetching event data:", error);
      alert(`Failed to load event data: ${error.message}`);
    }
  };

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
  
        const response = await fetch("http://localhost:8080/api/storage/upload",{
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

  const handleEdit = async (event) => {
    console.log("Editing event:", event);
  
    try {
      const isFile = (item) =>
        item instanceof File ||
        item instanceof Blob ||
        (typeof item === "string" && item.startsWith("blob:"));
  
      // Xử lý eventImages
      const existingImageIds =
        event.uploadedImages?.filter((item) => typeof item === "string" && item.startsWith("http")) || [];
      const newImages = event.uploadedImages?.filter(isFile) || [];
      const newImageIds = newImages.length > 0 ? await uploadFilesToCloudinary(newImages) : [];
      const eventImages = [...existingImageIds, ...newImageIds];
  
      // Xử lý mediaContent
      const existingMediaIds =
        event.overviewContent?.media
          ?.filter((item) => typeof item === "object" && item.url && item.url.startsWith("http"))
          .map((item) => item.url) || [];
      const newMedia = event.overviewContent?.media?.filter((item) =>
        isFile(item) || (typeof item === "object" && isFile(item.url))
      ) || [];
      const newMediaIds = newMedia.length > 0 ? await uploadFilesToCloudinary(newMedia) : [];
      const mediaContent = [...existingMediaIds, ...newMediaIds];
  
      // Xử lý tickets
      const ticketData = [];
      if (event.tickets?.length > 0) {
        for (const ticket of event.tickets) {
          ticketData.push({
            ticketId: ticket.ticketId || null, 
            ticketName: ticket.ticketName || "",
            ticketType: ticket.ticketType || "Paid",
            price: ticket.price || 0,
            quantity: ticket.quantity || 0,
            startTime: ticket.startTime || "", 
            endTime: ticket.endTime || "",
          });
        }
      }
  
      // Xử lý segments
      const segmentData = [];
      if (event.segment?.length > 0) {
        for (const segment of event.segment) {
          const uploadedSpeakerImage = segment?.speaker?.speakerImage
            ? (await uploadFilesToCloudinary([segment.speaker.speakerImage]))[0]
            : segment.speaker?.speakerImage || null;
  
          segmentData.push({
            segmentId: segment.segmentId || null, // Nếu không có segmentId thì để null
            segmentTitle: segment.segmentTitle || "",
            speaker: segment.speaker
              ? {
                  speakerId: segment.speaker.speakerId || null,
                  speakerImage: uploadedSpeakerImage || "",
                  speakerName: segment.speaker.speakerName || "",
                  speakerEmail: segment.speaker.speakerEmail || null,
                  speakerTitle: segment.speaker.speakerTitle || null,
                  speakerPhone: segment.speaker.speakerPhone || null,
                  speakerAddress: segment.speaker.speakerAddress || null,
                  speakerDesc: segment.speaker.speakerDesc || "",
                }
              : null,
            eventID: event.eventId || null,
            segmentDesc: segment.segmentDesc || "",
            startTime: segment.startTime
              ? `${event.eventLocation.date}T${segment.startTime}:00`
              : "2025-04-05T12:10:00.000+00:00", // Giá trị mặc định nếu thiếu
            endTime: segment.endTime
              ? `${event.eventLocation.date}T${segment.endTime}:00`
              : "2025-04-05T17:06:00.000+00:00", // Giá trị mặc định nếu thiếu
          });
        }
      }
  
      
      const payload = {
        event: {
          eventId: eventId || null,
          eventName: event.eventName || "",
          eventDesc: event.eventDesc || "",
          eventType: event.eventType || "Conference",
          eventHost: event.eventHost || "OFFICE",
          eventStatus: event.eventStatus || "public",
          eventStart:
            event.eventLocation.date && event.eventLocation.startTime
              ? `${event.eventLocation.date}T${event.eventLocation.startTime}:00`
              : "2025-04-05T12:10:00",
          eventEnd:
            event.eventLocation.date && event.eventLocation.endTime
              ? `${event.eventLocation.date}T${event.eventLocation.endTime}:00`
              : "2025-04-05T14:06:00",
              eventLocation: {
                date: event.eventStart.split('T')[0], 
                startTime: event.eventStart.split('T')[1].slice(0, 5),
                endTime: event.eventEnd.split('T')[1].slice(0, 5),
                locationType: event.eventLocation.locationType || "venue", 
                venueName: event.eventLocation.venueName || "", 
                venueSlug: event.eventLocation.venueSlug || "", 
                address: event.eventLocation.address || "", 
                city: event.eventLocation.city || "",
              },
          eventVisibility: event.eventVisibility || "public",
          publishTime: event.publishTime || "now",
          refunds: event.refunds || "yes",
          validityDays: event.validityDays || 7,
          eventImages: eventImages,
          textContent: event.overviewContent?.text || "",
          mediaContent: mediaContent,
          tags: event.tags?.join("|") || "",
        },
        ticket: ticketData,
        segment: segmentData,
      };
  
      
      const response = await fetch("http://localhost:8080/api/events/edit", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
      },
        method: "PUT",
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to edit event: ${errorText}`);
      }
  
      const result = await response.json();
      console.log("Event edited successfully:", result);
      alert("Event edited successfully!");
  
    } catch (error) {
      console.error("Failed to edit event:", error);
      alert(`Failed to edit event: ${error.message}`);
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
         
            onNext={() => setSelectedStep("publish")}
          />
        );
      case "publish":
        return (
          <EventPublishing
            event={event}
            setEvent={setEvent}
            onPublish={() => handleEdit(event)}
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

export default EditEvent;