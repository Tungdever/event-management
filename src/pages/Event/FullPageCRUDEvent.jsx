import React, { useState } from "react";
import EventForm from "./CreateEvent";
import AddTicket from "../Ticket/AddTicket";
import EventPublishing from "./EventPublishing";

const eventData = {
    event_id: 1,
    event_desc: "Đêm nhạc Acoustic với các ca sĩ nổi tiếng",
    event_image:
      "https://cdn.evbstatic.com/s3-build/fe/build/images/08f04c907aeb48f79070fd4ca0a584f9-citybrowse_desktop.webp",
    event_name: "Acoustic Night 2025",
    man_id: 101,
    mc_id: 202,
    event_type: "Concert",
    event_host: "Công ty Âm Nhạc XYZ",
    event_location: "Sheraton Hanoi Hotel 11 Đường Xuân Diệu Hanoi, Hà Nội ",
    event_status: "Sắp diễn ra",
    event_start: "2025-03-15T19:00:00",
    event_end: "2025-03-15T22:00:00",
  };

const CRUDEvent = () => {
  
  const [selectedStep, setSelectedStep] = useState("build");

  const renderStepComponent = () => {
    switch (selectedStep) {
      case "build":
        return <EventForm />;
      case "tickets":
        return <AddTicket />;
      case "publish":
        return <EventPublishing eventData={eventData}/>;
      default:
        return <EventForm />;
    }
  };

  return (
    <div className="bg-gray-50 flex flex-col lg:flex-row justify-center items-start lg:items-stretch p-6 space-y-4 lg:space-y-0 lg:space-x-2 min-h-screen">
      {/* Left Section */}
      <aside className="bg-white w-full lg:w-1/4 p-4 shadow-sm ">
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <h2 className="text-lg font-semibold">
            Mental Health First Aid (MHFA) Training (CPD Accredited)
          </h2>
          <div className="flex items-center text-gray-500 mt-2">
            <i className="far fa-calendar-alt mr-2"></i>
            <span>Wed, Apr 16, 2025, 10:00 AM</span>
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
            <label key={step} className="flex items-center space-x-2 cursor-pointer">
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

      {/* Right Section */}
      <div className="px-2 w-full lg:w-3/4">{renderStepComponent()}</div>
    </div>
  );
};

export default CRUDEvent;
