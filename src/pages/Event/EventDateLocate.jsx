import React, { useState, useEffect } from "react";

const vietnamCities = [
  { slug: "ho-chi-minh", name: "TP. Hồ Chí Minh" },
  { slug: "ha-noi", name: "Hà Nội" },
  { slug: "da-nang", name: "Đà Nẵng" },
  { slug: "nha-trang", name: "Nha Trang" },
];

const DatetimeLocation = ({ locationData, onLocationUpdate }) => {
  const [showDetail, setShowDetail] = useState(false);
  const [eventLocation, setEventLocation] = useState({
    date: "",
    startTime: "",
    endTime: "",
    locationType: "venue",
    venueName: "",
    venueSlug: "",
    address: "",
    city: "",
    ...locationData,
  });

  useEffect(() => {
    const dateBegin = localStorage.getItem("dateBegin");
    if (dateBegin) {
      const isValidDate = !isNaN(new Date(dateBegin).getTime());
      if (isValidDate) {
        setEventLocation((prevData) => {
          const updatedData = {
            ...prevData,
            date: dateBegin,
          };
          return updatedData;
        });
        localStorage.removeItem("dateBegin");
      }
    }
  }, []);

  const normalizeVenueName = (name) => {
    return name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  };

  const isFormValid = () => {
    const hasDate = eventLocation.date && eventLocation.date.trim() !== "";
    const hasStartTime = eventLocation.startTime && eventLocation.startTime.trim() !== "";
    const hasEndTime = eventLocation.endTime && eventLocation.endTime.trim() !== "";

    if (eventLocation.locationType === "venue") {
      const hasVenueName = eventLocation.venueName && eventLocation.venueName.trim() !== "";
      const hasAddress = eventLocation.address && eventLocation.address.trim() !== "";
      const hasCity = eventLocation.city && eventLocation.city.trim() !== "";
      return hasDate && hasStartTime && hasEndTime && hasVenueName && hasAddress && hasCity;
    }

    return hasDate && hasStartTime && hasEndTime;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventLocation((prevData) => {
      let updatedData = {
        ...prevData,
        [name]: value,
      };

      if (name === "venueName") {
        updatedData.venueSlug = normalizeVenueName(value);
      }

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
    if (isFormValid()) {
      setShowDetail(false);
    }
  };

  const getCityDisplayName = (slug) => {
    const city = vietnamCities.find((c) => c.slug === slug);
    return city ? city.name : slug;
  };

  return (
    <div>
      {showDetail ? (
        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg border border-blue-500 max-w-full sm:max-w-[600px] lg:max-w-[710px] w-full mb-4">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6">Date and Location</h1>
          <div className="mb-4 sm:mb-6">
            <label className="block text-gray-700 text-sm sm:text-base lg:text-lg mb-2">
              Date and time <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="w-full">
                <input
                  type="date"
                  name="date"
                  value={eventLocation.date}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 sm:p-2.5 lg:p-3 text-sm sm:text-base"
                />
                {!eventLocation.date && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">Date is required</p>
                )}
              </div>
              <div className="w-full">
                <input
                  type="time"
                  name="startTime"
                  value={eventLocation.startTime}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 sm:p-2.5 lg:p-3 text-sm sm:text-base"
                />
                {!eventLocation.startTime && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">Start time is required</p>
                )}
              </div>
              <div className="w-full">
                <input
                  type="time"
                  name="endTime"
                  value={eventLocation.endTime}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 sm:p-2.5 lg:p-3 text-sm sm:text-base"
                />
                {!eventLocation.endTime && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">End time is required</p>
                )}
              </div>
            </div>
          </div>
          <label className="block text-gray-700 text-sm sm:text-base lg:text-lg mb-2">Location</label>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-2 sm:mb-4">
            <button
              className={`flex items-center p-3 sm:p-4 border rounded-lg w-full sm:w-1/3 text-sm sm:text-base ${
                eventLocation.locationType === "venue"
                  ? "border-blue-500 bg-blue-100"
                  : "border-gray-300"
              }`}
              onClick={() => handleLocationTypeChange("venue")}
            >
              <i className="fas fa-map-marker-alt text-gray-500 mr-2 text-sm sm:text-base"></i>
              <p className="font-semibold">Venue</p>
            </button>
            <button
              className={`flex items-center p-3 sm:p-4 border rounded-lg w-full sm:w-1/3 text-sm sm:text-base ${
                eventLocation.locationType === "online"
                  ? "border-blue-500 bg-blue-100"
                  : "border-gray-300"
              }`}
              onClick={() => handleLocationTypeChange("online")}
            >
              <i className="fas fa-video text-blue-500 mr-2 text-sm sm:text-base"></i>
              <p className="font-semibold">Online Event</p>
            </button>
          </div>
          {eventLocation.locationType !== "online" && (
            <div className="max-w-full rounded-lg w-full">
              <form>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm sm:text-base lg:text-lg mb-2">
                    Venue Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="venueName"
                    value={eventLocation.venueName}
                    onChange={handleChange}
                    placeholder="Venue Name"
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 border rounded-md text-sm sm:text-base"
                  />
                  {!eventLocation.venueName && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">Venue name is required</p>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 text-sm sm:text-base lg:text-lg mb-2">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={eventLocation.address}
                      onChange={handleChange}
                      placeholder="Address"
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 border rounded-md text-sm sm:text-base"
                    />
                    {!eventLocation.address && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1">Address is required</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm sm:text-base lg:text-lg mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="city"
                      value={eventLocation.city}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 border rounded-md text-sm sm:text-base"
                    >
                      <option value="">Select a city</option>
                      {vietnamCities.map((city) => (
                        <option key={city.slug} value={city.slug}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                    {!eventLocation.city && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1">City is required</p>
                    )}
                  </div>
                </div>
              </form>
            </div>
          )}
          <button
            className={`mt-4 px-4 sm:px-6 py-2 sm:py-2.5 lg:py-3 rounded-lg text-sm sm:text-base ${
              isFormValid() ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={handleComplete}
            disabled={!isFormValid()}
          >
            Complete
          </button>
        </div>
      ) : (
        <div
          className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg border border-blue-500 max-w-full sm:max-w-[600px] lg:max-w-[710px] w-full mb-4 cursor-pointer"
          onClick={() => setShowDetail(true)}
        >
          <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center mb-4 space-y-3 sm:space-y-0">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold">Date and time</h2>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold sm:ml-8 lg:ml-16">Location</h2>
          </div>
          <div className="flex flex-col sm:flex-row justify-start items-start sm:items-start space-y-3 sm:space-y-0">
            <div className="flex items-start">
              <i className="far fa-calendar-alt text-base sm:text-lg lg:text-xl mr-2"></i>
              <div>
                <p className="font-medium text-sm sm:text-base lg:text-lg">{eventLocation.date || "Not set"}</p>
                <p className="text-gray-500 text-xs sm:text-sm">
                  {eventLocation.startTime && eventLocation.endTime
                    ? `${eventLocation.startTime} - ${eventLocation.endTime}`
                    : "Time not set"}
                </p>
              </div>
            </div>
            <div className="flex items-start sm:ml-6 lg:ml-[90px]">
              <i className="fas fa-map-marker-alt text-base sm:text-lg lg:text-xl mr-2"></i>
              <div>
                {eventLocation.locationType === "online" ? (
                  <p className="font-medium text-sm sm:text-base lg:text-lg">Online Event</p>
                ) : (
                  <p className="font-medium text-sm sm:text-base lg:text-lg">
                    {eventLocation.venueName
                      ? `${eventLocation.venueName}, ${eventLocation.address}, ${getCityDisplayName(
                          eventLocation.city
                        )}`
                      : "Location not set"}
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