import React, { useState,useEffect } from "react";

const DatetimeLocation = ({ locationData, onLocationUpdate }) => {
  const [showDetail, setShowDetail] = useState(false);
  const [eventLocation, setEventLocation] = useState(locationData);

 
  useEffect(() => {
    setEventLocation(locationData);
  }, [locationData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventLocation((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: value,
      };
      onLocationUpdate(updatedData); 
      return updatedData;
    });
  };

  const handleLocationTypeChange = (type) => {
    setEventLocation((prevData) => {
      const updatedData = { ...prevData, locationType: type };
      onLocationUpdate(updatedData); 
      return updatedData;
    });
  };

  const handleComplete = () => {
    setShowDetail(false);
  };

  return (
    <div>
      {showDetail ? (
        <div className="bg-white p-8 rounded-lg border border-blue-500 max-w-[710px] w-full mb-4">
          <h1 className="text-2xl font-bold mb-6">Date and Location</h1>
          <div className="mb-6">
            <label className="block text-gray-700">Date and time</label>
            <div className="flex space-x-4">
              <input
                type="date"
                name="date"
                value={eventLocation.date}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 mt-1"
              />
              <input
                type="time"
                name="startTime"
                value={eventLocation.startTime}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 mt-1"
              />
              <input
                type="time"
                name="endTime"
                value={eventLocation.endTime}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 mt-1"
              />
            </div>
          </div>
          <label className="block text-gray-700 mb-2">Location</label>
          <div className="flex space-x-4 mb-2">
            <button
              className={`flex items-center p-4 border rounded-lg w-1/3 ${
                eventLocation.locationType === "venue"
                  ? "border-blue-500 bg-blue-100"
                  : "border-gray-300"
              }`}
              onClick={() => handleLocationTypeChange("venue")}
            >
              <i className="fas fa-map-marker-alt text-gray-500 mr-2"></i>
              <p className="font-semibold">Venue</p>
            </button>
            <button
              className={`flex items-center p-4 border rounded-lg w-1/3 ${
                eventLocation.locationType === "online"
                  ? "border-blue-500 bg-blue-100"
                  : "border-gray-300"
              }`}
              onClick={() => handleLocationTypeChange("online")}
            >
              <i className="fas fa-video text-blue-500 mr-2"></i>
              <p className="font-semibold">Online Event</p>
            </button>
          </div>
          {eventLocation.locationType !== "online" && (
            <div className="max-w-4xl bg-white rounded-lg w-full">
              <form>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Venue Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="venueName"
                    value={eventLocation.venueName}
                    onChange={handleChange}
                    placeholder="Venue Name"
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={eventLocation.address}
                      onChange={handleChange}
                      placeholder="Address"
                      className="w-full px-4 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={eventLocation.city}
                      onChange={handleChange}
                      placeholder="City"
                      className="w-full px-4 py-2 border rounded-md"
                    />
                  </div>
                </div>
              </form>
            </div>
          )}
          <button
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg"
            onClick={handleComplete}
          >
            Complete
          </button>
        </div>
      ) : (
        <div
          className="bg-white p-8 rounded-lg border border-blue-500 max-w-[710px] w-full mb-4"
          onClick={() => setShowDetail(true)}
        >
          <div className="flex justify-start items-center mb-4">
            <h2 className="text-2xl font-semibold">Date and time</h2>
            <h2 className="text-2xl font-semibold ml-16">Location</h2>
          </div>
          <div className="flex justify-start items-start mb-4">
            <div className="flex items-start">
              <i className="far fa-calendar-alt text-xl mr-2"></i>
              <div>
                <p className="font-medium">{eventLocation.date}</p>
                <p className="text-gray-500">
                  {eventLocation.startTime} - {eventLocation.endTime}
                </p>
              </div>
            </div>
            <div className="flex items-start ml-[90px]">
              <i className="fas fa-map-marker-alt text-xl mr-2"></i>
              <div>
                {eventLocation.locationType !== "online" && (
                  <p className="font-medium">
                    {eventLocation.venueName}, {eventLocation.address},{" "}
                    {eventLocation.city}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatetimeLocation;
