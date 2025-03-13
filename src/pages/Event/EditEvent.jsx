import { useState } from "react";


const EventzillaSettings =()=> {
  const [branding, setBranding] = useState("no");
  const [listEvent, setListEvent] = useState(false);
  const [viewOtherEvents, setViewOtherEvents] = useState(false);
  const [inviteOnly, setInviteOnly] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ branding, listEvent, viewOtherEvents, inviteOnly });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 ">
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-4">Remove Eventzilla Branding</h2>
        <p className="text-gray-700 mb-4">
          By enabling this setting, you can remove the Eventzilla brand from your event registration flow and all associated collateral.
        </p>
        <div className="mb-4">
          <p className="text-gray-700 mb-2">Would you like to remove Eventzilla brand from your event registration flow?</p>
          <div className="flex items-center mb-2">
            <input
              type="radio"
              id="remove-branding-no"
              name="remove-branding"
              className="mr-2"
              checked={branding === "no"}
              onChange={() => setBranding("no")}
            />
            <label htmlFor="remove-branding-no" className="text-gray-700">No</label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="remove-branding-yes"
              name="remove-branding"
              className="mr-2"
              checked={branding === "yes"}
              onChange={() => setBranding("yes")}
            />
            <label htmlFor="remove-branding-yes" className="text-gray-700">Yes</label>
          </div>
        </div>
        <div className="mb-4">
          <input
            type="checkbox"
            id="list-event"
            className="mr-2"
            checked={listEvent}
            onChange={() => setListEvent(!listEvent)}
          />
          <label htmlFor="list-event" className="text-gray-700">
            List this event publicly in Eventzilla and its partner directories for increased exposure.
          </label>
        </div>
        <div className="mb-4">
          <input
            type="checkbox"
            id="view-other-events"
            className="mr-2"
            checked={viewOtherEvents}
            onChange={() => setViewOtherEvents(!viewOtherEvents)}
          />
          <label htmlFor="view-other-events" className="text-gray-700">
            Display view other events link on the event page
          </label>
        </div>
        <div className="mb-4">
          <input
            type="checkbox"
            id="invite-only"
            className="mr-2"
            checked={inviteOnly}
            onChange={() => setInviteOnly(!inviteOnly)}
          />
          <label htmlFor="invite-only" className="text-gray-700">Invite only event</label>
        </div>
      </div>
     
    </form>
  );
}

export default function EventForm() {
  const [formData, setFormData] = useState({
    eventName: "",
    eventType: "Conference",
    eventLanguage: "English",
    eventCurrency: "U.S. Dollars ($)",
    eventTimezone: "(GMT-0500) United States (New York) Time",
    eventStarts: "",
    eventStartTime: "",
    eventEnds: "",
    eventEndTime: "",
    recurringSchedule: false,
    countdownDisplay: false,
    eventHost: "Trung Hà",
    organizerDescription: "",
    eventDescription: "zzzzz",
    removeBranding: "No",
    listEvent: false,
    viewOtherEvents: false,
    inviteOnly: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className=" max-w-4xl mx-auto p-6 bg-white shadow-md mt-10">
      <h1 className="text-2xl font-semibold mb-6">Event title and description</h1>
      <p className="text-gray-600 mb-4">
        Fields marked <span className="text-red-500">*</span> are Required
      </p>
      <form>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Event name <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            type="text"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            placeholder="Title of your event (example: Tech conference 2024)"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Event type *</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
          >
            <option>Conference 1</option>
            <option>Conference 2</option>
            <option>Conference 3</option>
            <option>Conference 4</option>
            <option>Conference 5</option>
            <option>Conference 6</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Event Language</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            name="eventLanguage"
            value={formData.eventLanguage}
            onChange={handleChange}
          >
            <option>English</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Specify a different currency for this event (Optional)
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            name="eventCurrency"
            value={formData.eventCurrency}
            onChange={handleChange}
          >
            <option>U.S. Dollars ($)</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Time zone where the event happens</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            name="eventTimezone"
            value={formData.eventTimezone}
            onChange={handleChange}
          >
            <option>(GMT-0500) United States (New York) Time</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Event starts *</label>
          <div className="flex space-x-2">
            <input
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-md"
              type="date"
              name="eventStarts"
              value={formData.eventStarts}
              onChange={handleChange}
            />
            <input
              className="w-1/4 px-3 py-2 border border-gray-300 rounded-md"
              type="time"
              name="eventStartTime"
              value={formData.eventStartTime}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Event ends *</label>
          <div className="flex space-x-2">
            <input
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-md"
              type="date"
              name="eventEnds"
              value={formData.eventEnds}
              onChange={handleChange}
            />
            <input
              className="w-1/4 px-3 py-2 border border-gray-300 rounded-md"
              type="time"
              name="eventEndTime"
              value={formData.eventEndTime}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mb-4">
          <input
            type="checkbox"
            name="recurringSchedule"
            checked={formData.recurringSchedule}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="text-gray-700">This event has a recurring schedule</label>
        
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Organizer description *</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            name="Organizer Description"
            value={formData.organizerDescription}
            onChange={handleChange}
            rows="5"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Event description *</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            name="eventDescription"
            value={formData.eventDescription}
            onChange={handleChange}
            rows="5"
          ></textarea>
        </div>
    <EventzillaSettings />
        <div className="flex justify-end">
          <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-md">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
