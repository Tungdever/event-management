import { useState } from "react";

export default function CreateTickets() {
  const [eventStatus, setEventStatus] = useState("add-tickets");
  const [ticketType, setTicketType] = useState("paid");

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col lg:flex-row justify-center items-start lg:items-center p-6 space-y-6 lg:space-y-0 lg:space-x-6">
      {/* Left Section */}
      <div className="bg-white shadow-md rounded-lg p-6 w-full lg:w-1/2">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center">
            <img
              src="https://storage.googleapis.com/a1aa/image/gSPRimGlc2UO_9YX2y2zNM5vidag7cU7jWczbJdELgU.jpg"
              alt="Event Thumbnail"
              className="rounded-full"
              width={50}
              height={50}
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold">a</h2>
            <p className="text-gray-500">
              <i className="far fa-calendar-alt" /> Fri, Mar 28, 2025, 10:00 AM
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center space-x-4">
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md">
            Draft <i className="fas fa-caret-down" />
          </button>
          <a href="#" className="text-blue-500">
            Preview <i className="fas fa-external-link-alt" />
          </a>
        </div>
        <div className="mt-6 space-y-4">
          {[
            { id: "build-event-page", label: "Build event page" },
            { id: "add-tickets", label: "Add tickets" },
            { id: "publish", label: "Publish" },
          ].map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <input
                type="radio"
                id={option.id}
                name="event-status"
                checked={eventStatus === option.id}
                onChange={() => setEventStatus(option.id)}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <label htmlFor={option.id} className="text-gray-700">
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>
      {/* Right Section */}
      <div className="bg-white shadow-md rounded-lg p-6 w-full lg:w-1/2">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Let's create tickets
        </h2>
        <p className="text-gray-500 mb-6">
          Create a section if you want to sell multiple ticket types that share the same inventory.
        </p>
        <div className="flex space-x-4 mb-6">
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md">
            Create a section
          </button>
          <button className="bg-orange-600 text-white px-4 py-2 rounded-md">
            Add tickets
          </button>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Add tickets</h3>
          <div className="flex space-x-4 mb-4">
            {[
              { id: "paid", label: "Paid" },
              { id: "free", label: "Free" },
              { id: "donation", label: "Donation" },
            ].map((type) => (
              <button
                key={type.id}
                className={`px-4 py-2 rounded-md ${
                  ticketType === type.id ? "bg-blue-100 text-blue-700" : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setTicketType(type.id)}
              >
                {type.label}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            <label className="block text-gray-700">
              Name *
              <input type="text" className="w-full border rounded-md p-2" defaultValue="General Admission" />
            </label>
            <label className="block text-gray-700">
              Available quantity *
              <input type="number" className="w-full border rounded-md p-2" />
            </label>
            <label className="block text-gray-700">
              Price *
              <div className="flex items-center">
                <span className="bg-gray-200 px-4 py-2 rounded-l-md border border-r-0 border-gray-300">$</span>
                <input type="text" className="w-full border rounded-r-md p-2" defaultValue="0.00" />
              </div>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="block text-gray-700">
                Sales start *
                <input type="date" className="w-full border rounded-md p-2" defaultValue="2025-02-17" />
              </label>
              <label className="block text-gray-700">
                Start time
                <input type="time" className="w-full border rounded-md p-2" defaultValue="00:00" />
              </label>
              <label className="block text-gray-700">
                Sales end *
                <input type="date" className="w-full border rounded-md p-2" defaultValue="2025-03-28" />
              </label>
              <label className="block text-gray-700">
                End time
                <input type="time" className="w-full border rounded-md p-2" defaultValue="10:00" />
              </label>
            </div>
            <p className="text-gray-500 text-sm">Event time zone is AST <i className="fas fa-info-circle" /></p>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md">Cancel</button>
            <button className="bg-orange-600 text-white px-4 py-2 rounded-md">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
