import React, { useState, useEffect } from "react";

const vietnamCities = [
  { slug: "ho-chi-minh", name: "TP. Hồ Chí Minh" },
  { slug: "ha-noi", name: "Hà Nội" },
  { slug: "da-nang", name: "Đà Nẵng" },
  { slug: "hai-phong", name: "Hải Phòng" },
  { slug: "can-tho", name: "Cần Thơ" },
  { slug: "nha-trang", name: "Nha Trang" },
  { slug: "da-lat", name: "Đà Lạt" },
  { slug: "binh-duong", name: "Bình Dương" },
  { slug: "dong-nai", name: "Đồng Nai" },
  { slug: "quang-ninh", name: "Quảng Ninh" },
];

const DatetimeLocation = ({ locationData, onLocationUpdate,isReadOnly }) => {
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
    const hasStartTime =
      eventLocation.startTime && eventLocation.startTime.trim() !== "";
    const hasEndTime =
      eventLocation.endTime && eventLocation.endTime.trim() !== "";

    if (eventLocation.locationType === "venue") {
      const hasVenueName =
        eventLocation.venueName && eventLocation.venueName.trim() !== "";
      const hasAddress =
        eventLocation.address && eventLocation.address.trim() !== "";
      const hasCity = eventLocation.city && eventLocation.city.trim() !== "";
      return (
        hasDate &&
        hasStartTime &&
        hasEndTime &&
        hasVenueName &&
        hasAddress &&
        hasCity
      );
    }

    return hasDate && hasStartTime && hasEndTime;
  };

  const handleChange = (e) => {
    if (isReadOnly) return;
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
    if (isReadOnly) return;
    setEventLocation((prevData) => {
      const updatedData = { ...prevData, locationType: type };
      onLocationUpdate(updatedData);
      return updatedData;
    });
  };

  const handleComplete = () => {
    if (isReadOnly) return;
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
          <h1 className="mb-4 text-lg font-bold sm:text-xl lg:text-2xl sm:mb-6">
            Date and Location
          </h1>
          <div className="mb-4 sm:mb-6">
            <label className="block mb-2 text-sm text-gray-700 sm:text-base lg:text-lg">
              Date and time
            </label>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <div className="w-full">
                <input
                  type="date"
                  name="date"
                  value={eventLocation.date}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className="w-full border border-gray-300 rounded-lg p-2 sm:p-2.5 lg:p-3 text-sm sm:text-base"
                />
                {!eventLocation.date && (
                  <p className="mt-1 text-xs text-red-500 sm:text-sm">
                    Date is required
                  </p>
                )}
              </div>
              <div className="w-full">
                <input
                  type="time"
                  name="startTime"
                  value={eventLocation.startTime}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className="w-full border border-gray-300 rounded-lg p-2 sm:p-2.5 lg:p-3 text-sm sm:text-base"
                />
                {!eventLocation.startTime && (
                  <p className="mt-1 text-xs text-red-500 sm:text-sm">
                    Start time is required
                  </p>
                )}
              </div>
              <div className="w-full">
                <input
                  type="time"
                  name="endTime"
                  value={eventLocation.endTime}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className="w-full border border-gray-300 rounded-lg p-2 sm:p-2.5 lg:p-3 text-sm sm:text-base"
                />
                {!eventLocation.endTime && (
                  <p className="mt-1 text-xs text-red-500 sm:text-sm">
                    End time is required
                  </p>
                )}
              </div>
            </div>
          </div>
          <label className="block mb-2 text-sm text-gray-700 sm:text-base lg:text-lg">
            Location
          </label>
          <div className="flex flex-col mb-2 space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 sm:mb-4">
            <button
            disabled={isReadOnly}
              className={`${isReadOnly ? 'cursor-not-allowed opacity-50' : ''} flex items-center p-3 sm:p-4 border rounded-lg w-full sm:w-1/3 text-sm sm:text-base ${
                eventLocation.locationType === "venue"
                  ? "border-blue-500 bg-blue-100"
                  : "border-gray-300"
              }`}
              onClick={() => handleLocationTypeChange("venue")}
            >
              <i className="mr-2 text-sm text-gray-500 fas fa-map-marker-alt sm:text-base"></i>
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
              <i className="mr-2 text-sm text-blue-500 fas fa-video sm:text-base"></i>
              <p className="font-semibold">Online Event</p>
            </button>
          </div>
          {eventLocation.locationType !== "online" && (
            <div className="w-full max-w-full rounded-lg">
              <form>
                <div className="mb-4">
                  <label className="block mb-2 text-sm text-gray-700 sm:text-base lg:text-lg">
                    Venue Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="venueName"
                    value={eventLocation.venueName}
                    onChange={handleChange}
                    disabled={isReadOnly}
                    placeholder="Venue Name"
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 border rounded-md text-sm sm:text-base"
                  />
                  {!eventLocation.venueName && (
                    <p className="mt-1 text-xs text-red-500 sm:text-sm">
                      Venue name is required
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-3 mb-4 sm:grid-cols-2 sm:gap-4">
                  <div>
                    <label className="block mb-2 text-sm text-gray-700 sm:text-base lg:text-lg">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={eventLocation.address}
                      onChange={handleChange}
                      disabled={isReadOnly}
                      placeholder="Address"
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 border rounded-md text-sm sm:text-base"
                    />
                    {!eventLocation.address && (
                      <p className="mt-1 text-xs text-red-500 sm:text-sm">
                        Address is required
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block mb-2 text-sm text-gray-700 sm:text-base lg:text-lg">
                      City <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="city"
                      value={eventLocation.city}
                      onChange={handleChange}
                      disabled={isReadOnly}
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
                      <p className="mt-1 text-xs text-red-500 sm:text-sm">
                        City is required
                      </p>
                    )}
                  </div>
                </div>
              </form>
            </div>
          )}
          {!isReadOnly && (<button
            className={`mt-4 px-4 sm:px-6 py-2 sm:py-2.5 lg:py-3 rounded-lg text-sm sm:text-base ${
              isFormValid()
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={handleComplete}
            disabled={!isFormValid()}
          >
            Complete
          </button>)}
          
        </div>
      ) : (
        <div
          className="bg-white p-4 sm:p-5 lg:p-6 rounded-xl border border-blue-400 max-w-full sm:max-w-[600px] lg:max-w-[710px] w-full mb-4 cursor-pointer shadow  transition"
          onClick={isReadOnly ? null : () => setShowDetail(true)}
        >
          <div className="flex flex-col items-start justify-start mb-3 space-y-2 sm:flex-row sm:items-center sm:space-y-0">
            <h2 className="text-base font-semibold text-gray-800 sm:text-lg lg:text-xl">
              Date and Time
            </h2>
            <h2 className="text-base font-semibold text-gray-800 sm:text-lg lg:text-xl sm:ml-6 lg:ml-12">
              Location
            </h2>
          </div>
          <div className="flex flex-col items-start justify-start space-y-2 sm:flex-row sm:items-start sm:space-y-0">
            <div className="flex items-start">
              <i className="mr-2 text-sm text-blue-500 far fa-calendar-alt sm:text-base lg:text-base"></i>
              <div>
                <p className="text-xs font-medium text-gray-800 sm:text-sm lg:text-base">
                  {eventLocation.date || "Not set"}
                </p>
                <p className="text-xs text-gray-600 sm:text-xs">
                  {eventLocation.startTime && eventLocation.endTime
                    ? `${eventLocation.startTime} - ${eventLocation.endTime}`
                    : "Time not set"}
                </p>
              </div>
            </div>
            <div className="flex items-start sm:ml-4 lg:ml-12">
              <i className="mr-2 text-sm text-blue-500 fas fa-map-marker-alt sm:text-base lg:text-base"></i>
              <div>
                {eventLocation.locationType === "online" ? (
                  <p className="text-xs font-medium text-gray-800 sm:text-sm lg:text-base">
                    Online Event
                  </p>
                ) : (
                  <p className="text-xs font-medium text-gray-800 sm:text-sm lg:text-base">
                    {eventLocation.venueName
                      ? `${eventLocation.venueName}, ${
                          eventLocation.address
                        }, ${getCityDisplayName(eventLocation.city)}`
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
