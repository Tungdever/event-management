import React, { useState, useEffect } from "react";
import EventForm from "./EventForm";
import AddTicket from "../Ticket/AddTicket";
import EventPublishing from "./EventPublishing";

const EditEvent = ({ eventId }) => { 
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
      const response = await fetch(`http://localhost:8080/api/events/edit/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch event data');
      }
      const data = await response.json();
      
      
      const transformedEvent = {
        eventName: data.event.eventName,
        eventDesc: data.event.eventDesc,
        eventType: data.event.eventType,
        eventHost: data.event.eventHost,
        eventStatus: data.event.eventStatus,
        eventStart: data.event.eventStart,
        eventEnd: data.event.eventEnd,
        eventLocation: {
          date: data.event.eventStart.split('T')[0],
          startTime: data.event.eventStart.split('T')[1].slice(0, 5),
          endTime: data.event.eventEnd.split('T')[1].slice(0, 5),
          locationType: data.event.eventLocation.includes('www') ? 'online' : 'physical',
          venueName: "",
          address: data.event.eventLocation,
          city: "",
        },
        tags: data.event.tags.split('|'),
        eventVisibility: data.event.eventVisibility,
        publishTime: data.event.publishTime,
        refunds: data.event.refunds,
        validityDays: data.event.validityDays,
        uploadedImages: data.event.eventImages,
        overviewContent: {
          text: data.event.textContent,
          media: data.event.mediaContent.map(url => ({ type: 'image', url }))
        },
        tickets: data.ticket.map(ticket => ({
          ticketId: ticket.ticketId,
          ticketName: ticket.ticketName,
          ticketType: ticket.ticketType,
          price: ticket.price,
          quantity: ticket.quantity,
          startTime: ticket.startTime,
          endTime: ticket.endTime
        })),
        segment: data.segment.map(seg => ({
          segmentId: seg.segmentId,
          segmentTitle: seg.segmentTitle,
          speaker: {
            speakerId: seg.speaker.speakerId,
            speakerImage: seg.speaker.speakerImage,
            speakerName: seg.speaker.speakerName,
            speakerDesc: seg.speaker.speakerDesc
          },
          segmentDesc: seg.segmentDesc,
          startTime: seg.startTime.split('T')[1].slice(0, 5),
          endTime: seg.endTime.split('T')[1].slice(0, 5)
        }))
      };

      setEvent(transformedEvent);
    } catch (error) {
      console.error('Error fetching event data:', error);
      alert('Failed to load event data');
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