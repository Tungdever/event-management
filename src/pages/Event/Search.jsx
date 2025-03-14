import { useState, useEffect } from "react";

import EventList from "../../components/EventListSearch";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const eventData = [
  {
    event_id: 1,
    event_name: "Acoustic Night 2025",
    event_image:
      "https://cdn.evbstatic.com/s3-build/fe/build/images/08f04c907aeb48f79070fd4ca0a584f9-citybrowse_desktop.webp",
    event_host: "Công ty Âm Nhạc XYZ",
    event_location: "Nhà hát Thành phố, TP.HCM",
    event_status: "Sắp diễn ra",
    event_type: "Concert",
    event_start: "2025-03-15T19:00:00",
    event_end: "2025-03-15T22:00:00",
  },
  {
    event_id: 2,
    event_name: "Acoustic Night 2025",
    event_image:
      "https://cdn.evbstatic.com/s3-build/fe/build/images/08f04c907aeb48f79070fd4ca0a584f9-citybrowse_desktop.webp",
    event_host: "Công ty Âm Nhạc XYZ",
    event_location: "Nhà hát Thành phố, TP.HCM",
    event_status: "Sắp diễn ra",
    event_type: "Concert",
    event_start: "2025-03-15T19:00:00",
    event_end: "2025-03-15T22:00:00",
  },
  {
    event_id: 3,
    event_name: "Acoustic Night 2025",
    event_image:
      "https://cdn.evbstatic.com/s3-build/fe/build/images/08f04c907aeb48f79070fd4ca0a584f9-citybrowse_desktop.webp",
    event_host: "Công ty Âm Nhạc XYZ",
    event_location: "Nhà hát Thành phố, TP.HCM",
    event_status: "Sắp diễn ra",
    event_type: "Concert",
    event_start: "2025-03-15T19:00:00",
    event_end: "2025-03-15T22:00:00",
  },
  {
    event_id: 4,
    event_name: "Acoustic Night 2025",
    event_image:
      "https://cdn.evbstatic.com/s3-build/fe/build/images/08f04c907aeb48f79070fd4ca0a584f9-citybrowse_desktop.webp",
    event_host: "Công ty Âm Nhạc XYZ",
    event_location: "Nhà hát Thành phố, TP.HCM",
    event_status: "Sắp diễn ra",
    event_type: "Concert",
    event_start: "2025-03-15T19:00:00",
    event_end: "2025-03-15T22:00:00",
  },
  {
    event_id: 5,
    event_name: "Acoustic Night 2025",
    event_image:
      "https://cdn.evbstatic.com/s3-build/fe/build/images/08f04c907aeb48f79070fd4ca0a584f9-citybrowse_desktop.webp",
    event_host: "Công ty Âm Nhạc XYZ",
    event_location: "Nhà hát Thành phố, TP.HCM",
    event_status: "Sắp diễn ra",
    event_type: "Concert",
    event_start: "2025-03-15T19:00:00",
    event_end: "2025-03-15T22:00:00",
  },
];
const Tags = () => {
  const tags = [
    "Online Events",
    "Things To Do Online",
    "Online Networking",
    "Online Health Networking",
    "#support",
    "#supportgroup",
    "#anxietyrelief",
    "#support_group",
    "#anxiety_relief",
    "#anxiety_support",
    "#anxiety_support_group",
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 mt-4">Tags</h2>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};
const FilterSidebar = () => {
  const [selectedCategories, setSelectedCategories] = useState(["concert"]);
  const [selectedEventType, setSelectedEventType] = useState("all-types");
  const [selectedEventTime, setSelectedEventTime] = useState("all-times");
  const [selectedEventLocation, setSelectedEventLocation] =
    useState("all-locations");

  const eventCategories = [
    { id: "conference", label: "Hội nghị" },
    { id: "workshop", label: "Workshop" },
    { id: "seminar", label: "Hội thảo" },
    { id: "concert", label: "Concert / Âm nhạc" },
    { id: "exhibition", label: "Triển lãm" },
  ];

  const eventTypes = [
    { id: "all-types", label: "Tất cả" },
    { id: "free", label: "Miễn phí" },
    { id: "paid", label: "Trả phí" },
    { id: "online", label: "Trực tuyến" },
    { id: "offline", label: "Trực tiếp" },
  ];

  const eventTimes = [
    { id: "all-times", label: "Tất cả" },
    { id: "today", label: "Hôm nay" },
    { id: "this-weekend", label: "Cuối tuần này" },
    { id: "this-month", label: "Tháng này" },
  ];

  const eventLocations = [
    { id: "all-locations", label: "Tất cả địa điểm" },
    { id: "hanoi", label: "Hà Nội" },
    { id: "hochiminh", label: "TP. Hồ Chí Minh" },
    { id: "danang", label: "Đà Nẵng" },
  ];

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedEventType("all-types");
    setSelectedEventTime("all-times");
    setSelectedEventLocation("all-locations");
  };

  return (
    <div className="w-full bg-white p-5 rounded-sm  space-y-6 overflow-y-auto h-[900px]">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-3">
        <h2 className="text-lg font-semibold text-gray-700">Bộ lọc sự kiện</h2>
        <button
          onClick={resetFilters}
          className="text-red-500 hover:text-red-600 font-medium"
        >
          Xóa lọc
        </button>
      </div>

      {/* Loại sự kiện */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Loại sự kiện</h3>
        <div className="space-y-2">
          {eventCategories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <input
                id={category.id}
                type="radio"
                name="eventCategory"
                checked={selectedCategories.includes(category.id)}
                onChange={() => setSelectedCategories([category.id])}
                className="w-4 h-4 border-2 border-orange-500 accent-red-500"
              />
              <label
                htmlFor={category.id}
                className="text-gray-600 cursor-pointer hover:text-orange-600"
              >
                {category.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Hình thức sự kiện */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Hình thức</h3>
        <div className="space-y-2">
          {eventTypes.map((type) => (
            <div key={type.id} className="flex items-center space-x-2">
              <input
                id={type.id}
                type="radio"
                name="eventType"
                checked={selectedEventType === type.id}
                onChange={() => setSelectedEventType(type.id)}
                className="w-4 h-4 border-2 border-orange-500 accent-red-500"
              />
              <label
                htmlFor={type.id}
                className="text-gray-600 cursor-pointer hover:text-orange-600"
              >
                {type.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Thời gian tổ chức */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Thời gian tổ chức</h3>
        <div className="space-y-2">
          {eventTimes.map((time) => (
            <div key={time.id} className="flex items-center space-x-2">
              <input
                id={time.id}
                type="radio"
                name="eventTime"
                checked={selectedEventTime === time.id}
                onChange={() => setSelectedEventTime(time.id)}
                className="aw-4 h-4 border-2 border-orange-500 accent-red-500"
              />
              <label
                htmlFor={time.id}
                className="text-gray-600 cursor-pointer hover:text-orange-600"
              >
                {time.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Địa điểm tổ chức */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Địa điểm tổ chức</h3>
        <div className="space-y-2">
          {eventLocations.map((location) => (
            <div key={location.id} className="flex items-center space-x-2">
              <input
                id={location.id}
                type="radio"
                name="eventLocation"
                checked={selectedEventLocation === location.id}
                onChange={() => setSelectedEventLocation(location.id)}
                className="w-4 h-4 border-2 border-orange-500 accent-red-500"
              />
              <label
                htmlFor={location.id}
                className="text-gray-600 cursor-pointer hover:text-orange-600"
              >
                {location.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SearchPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 250);
  }, []);
  return loading ? (
    <h1></h1>
  ) : (
    <>
      <Header />
      <div class=" mx-auto px-6 py-4">
        <nav class="text-sm text-orange-600 space-x-2 pt-2">
          <a href="#" class="hover:underline">
            Home
          </a>
          <span>/</span>
          <a href="#" class="hover:underline">
            Vietnam
          </a>
          <span>/</span>
          <a href="#" class="hover:underline">
            Ho Chi Minh
          </a>
          <span>/</span>
          <span class="text-gray-500">Live Music Events</span>
        </nav>
        <h1 class="text-3xl font-bold text-gray-700 mt-4">
          Live music events in Ho Chi Minh, Vietnam
        </h1>
      </div>
      <div className="flex flex-col md:flex-row gap-2 p-5">
        <div className="w-full md:w-1/4">
          <FilterSidebar />
        </div>

        <div className="w-full md:w-3/4 overflow-y-auto">
          <EventList event={eventData} />

          <Tags />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SearchPage;
