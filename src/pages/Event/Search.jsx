import { useState, useEffect } from "react";

import EventList from "../../components/EventListSearch";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useLocation } from "react-router-dom";
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

const FilterSidebar = ({ onFilterChange }) => {
  const [selectedCategories, setSelectedCategories] = useState("concert"); 
  const [selectedEventType, setSelectedEventType] = useState("all-types");
  const [selectedEventTime, setSelectedEventTime] = useState("all-times");
  const [selectedEventLocation, setSelectedEventLocation] = useState("all-locations");
  const [eventData, setEventData] = useState([]); 

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

  // Hàm gọi API dựa trên filter
  const fetchEvents = async (endpoint, param) => {
    try {
      const response = await fetch(`/api/events${endpoint}?${param}`);
      if (!response.ok) throw new Error("Failed to fetch events");
      const data = await response.json();
      setEventData(data); 
      onFilterChange(data); 
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  
  useEffect(() => {
    
    if (selectedCategories && selectedCategories !== "all-categories") {
      fetchEvents("/search/tags", `tag=${selectedCategories}`);
    } else if (selectedEventType && selectedEventType !== "all-types") {
      fetchEvents("/search/type", `type=${selectedEventType}`);
    } else if (selectedEventTime && selectedEventTime !== "all-times") {
     
      const today = new Date().toISOString().split("T")[0]; 
      fetchEvents("/search/date", `date=${today}`);
    } else if (selectedEventLocation && selectedEventLocation !== "all-locations") {
      fetchEvents("/search/location", `location=${selectedEventLocation}`);
    }
  }, [selectedCategories, selectedEventType, selectedEventTime, selectedEventLocation]);

  const resetFilters = () => {
    setSelectedCategories("all-categories");
    setSelectedEventType("all-types");
    setSelectedEventTime("all-times");
    setSelectedEventLocation("all-locations");
    setEventData([]); 
    onFilterChange([]); 
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-lg space-y-8 h-[900px] overflow-y-auto border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">Bộ lọc sự kiện</h2>
        <button
          onClick={resetFilters}
          className="text-red-500 hover:text-red-700 font-semibold transition-colors duration-200"
        >
          Xóa lọc
        </button>
      </div>

      {/* Loại sự kiện */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3 text-lg">Loại sự kiện</h3>
        <div className="space-y-3">
          {eventCategories.map((category) => (
            <div key={category.id} className="flex items-center space-x-3">
              <input
                id={category.id}
                type="radio"
                name="eventCategory"
                checked={selectedCategories === category.id}
                onChange={() => setSelectedCategories(category.id)}
                className="w-4 h-4 border-2 border-orange-500 accent-red-500"
              />
              <label
                htmlFor={category.id}
                className="text-gray-600 cursor-pointer hover:text-red-500 transition-colors duration-200"
              >
                {category.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Hình thức sự kiện */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3 text-lg">Hình thức</h3>
        <div className="space-y-3">
          {eventTypes.map((type) => (
            <div key={type.id} className="flex items-center space-x-3">
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
                className="text-gray-600 cursor-pointer hover:text-red-500 transition-colors duration-200"
              >
                {type.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Thời gian tổ chức */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3 text-lg">Thời gian tổ chức</h3>
        <div className="space-y-3">
          {eventTimes.map((time) => (
            <div key={time.id} className="flex items-center space-x-3">
              <input
                id={time.id}
                type="radio"
                name="eventTime"
                checked={selectedEventTime === time.id}
                onChange={() => setSelectedEventTime(time.id)}
                className="w-4 h-4 border-2 border-orange-500 accent-red-500"
              />
              <label
                htmlFor={time.id}
                className="text-gray-600 cursor-pointer hover:text-red-500 transition-colors duration-200"
              >
                {time.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Địa điểm tổ chức */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3 text-lg">Địa điểm tổ chức</h3>
        <div className="space-y-3">
          {eventLocations.map((location) => (
            <div key={location.id} className="flex items-center space-x-3">
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
                className="text-gray-600 cursor-pointer hover:text-red-500 transition-colors duration-200"
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
  const [events, setEvents] = useState([]); 
  const location = useLocation();

  useEffect(() => {
   
    const initialEvents = location.state?.events || [];
    setEvents(initialEvents);
    setTimeout(() => {
      setLoading(false);
    }, 250);
  }, [location.state]);

  
  const handleFilterChange = (filteredEvents) => {
    setEvents(filteredEvents);
  };

  return loading ? (
    <h1>Loading...</h1>
  ) : (
    <>
      
      <div className="mx-auto px-6 py-4">
        <nav className="text-sm text-orange-600 space-x-2 pt-2">
          <a href="#" className="hover:underline">
            Home
          </a>
          <span>/</span>
          <a href="#" className="hover:underline">
            Vietnam
          </a>
          <span>/</span>
          <a href="#" className="hover:underline">
            Ho Chi Minh
          </a>
          <span>/</span>
          <span className="text-gray-500">Live Music Events</span>
        </nav>
        <h1 className="text-3xl font-bold text-gray-700 mt-4">
          Live music events in Ho Chi Minh, Vietnam
        </h1>
      </div>
      <div className="flex flex-col md:flex-row gap-2 p-5">
        <div className="w-full md:w-1/4">
          <FilterSidebar onFilterChange={handleFilterChange} />
        </div>
        <div className="w-full md:w-3/4 overflow-y-auto">
          <EventList events={events} /> {/* Truyền danh sách sự kiện từ state */}
          <Tags />
        </div>
      </div>
      <Footer />
    </>
  );
};


export default SearchPage;
