import React from "react";

const EventForm = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-4xl mx-auto p-4">
        {/* Image Upload Section */}
        <div className="relative bg-gray-200 rounded-lg overflow-hidden mb-6">
          <img
            src="https://storage.googleapis.com/a1aa/image/oFssrRGOqYsjeanal5Ggc6TQow520FnOxiqapc7K5xs.jpg"
            alt="A busy event with people socializing in a large room"
            className="w-full h-64 object-cover opacity-50"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white bg-opacity-75 p-6 rounded-lg text-center">
              <i className="fas fa-upload text-2xl text-blue-500 mb-2"></i>
              <p className="text-blue-500">Upload photos & video</p>
            </div>
          </div>
        </div>

        {/* Event Overview Section */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4">Event Overview</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Event title</label>
            <input type="text" className="w-full border border-gray-300 rounded-lg p-2 mt-1" />
          </div>
          <div>
            <label className="block text-gray-700">Sub title</label>
            <input type="text" className="w-full border border-gray-300 rounded-lg p-2 mt-1" />
          </div>
        </div>

        {/* Date and Location Section */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4">Date and location</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Type of event</label>
            <select className="w-full border border-gray-300 rounded-lg p-2 mt-1">
              <option>Select event type</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Date and time</label>
            <div className="flex space-x-4">
              <input type="date" className="w-full border border-gray-300 rounded-lg p-2 mt-1" />
              <input type="time" className="w-full border border-gray-300 rounded-lg p-2 mt-1" placeholder="Start time" />
              <input type="time" className="w-full border border-gray-300 rounded-lg p-2 mt-1" placeholder="End time" />
            </div>
          </div>
          <div>
            <label className="block text-gray-700">Location</label>
            <input type="text" className="w-full border border-gray-300 rounded-lg p-2 mt-1" />
          </div>
        </div>

        {/* Overview Section */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4">Overview</h2>
          <textarea className="w-full border border-gray-300 rounded-lg p-2" rows="5"></textarea>
        </div>

        {/* Save Button */}
        <div className="text-right">
          <button className="bg-orange-600 text-white px-6 py-2 rounded-lg">Save and continue</button>
        </div>
      </div>
    </div>
  );
};

export default EventForm;
