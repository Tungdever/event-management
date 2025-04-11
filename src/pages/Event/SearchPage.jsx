import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import EventList from "../../components/EventListSearch";

import Footer from "../../components/Footer";
import Loader from "../../components/Loading";


const FilterSidebar = () => {
  const [selectedCategories, setSelectedCategories] = useState("all-types");
  const [selectedEventType, setSelectedEventType] = useState("all-types");
  const [selectedEventTime, setSelectedEventTime] = useState("all-times");
  const [selectedEventLocation, setSelectedEventLocation] =
    useState("all-locations");

  const eventCategories = [
    { id: "all-types", label: "All types" },
    { id: "conference", label: "Conference" },
    { id: "workshop", label: "Workshop" },
    { id: "seminar", label: "Seminar" },
    { id: "concert", label: "Concert " },
    { id: "exhibition", label: "Exhibition" },
  ];

  const eventTypes = [
    { id: "all-types", label: "All types" },
    { id: "free", label: "Free" },
    { id: "paid", label: "Paid" },
    { id: "online", label: "Online" },
    { id: "offline", label: "Offline" },
  ];

  const eventTimes = [
    { id: "all-times", label: "All times" },
    { id: "today", label: "Today" },
    { id: "this-month", label: "This month" },
  ];

  const eventLocations = [
    { id: "all-locations", label: "All location" },
    { id: "hanoi", label: "Hà Nội" },
    { id: "hochiminh", label: "TP. Hồ Chí Minh" },
    { id: "danang", label: "Đà Nẵng" },
  ];



  return (
    <div className="w-full bg-white p-6 rounded-[4px] space-y-8 border-r border-gray-200 ">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">Filters</h2>
        <button
          
          className="text-red-500 hover:text-red-700 font-semibold transition-colors duration-200 text-[13px]"
        >
          Delete filter
        </button>
      </div>

      <div>
        <h3 className="font-semibold text-gray-700 mb-3 text-lg">
          Event types
        </h3>
        <div className="space-y-3">
          {eventCategories.map((category) => (
            <div key={category.id} className="flex items-center space-x-3 text-[13px]">
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

      <div>
        <h3 className="font-semibold text-gray-700 mb-3 text-lg">Format</h3>
        <div className="space-y-3">
          {eventTypes.map((type) => (
            <div key={type.id} className="flex items-center space-x-3 text-[13px]">
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

      <div>
        <h3 className="font-semibold text-gray-700 mb-3 text-lg">
          Date
        </h3>
        <div className="space-y-3">
          {eventTimes.map((time) => (
            <div key={time.id} className="flex items-center space-x-3 text-[13px]">
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

      <div>
        <h3 className="font-semibold text-gray-700 mb-3 text-lg">
          Location
        </h3>
        <div className="space-y-3">
          {eventLocations.map((location) => (
            <div key={location.id} className="flex items-center space-x-3 text-[13px]">
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
    // Lấy dữ liệu events từ state được truyền từ SearchBar
    const initialEvents = location.state?.events || [];
    setEvents(initialEvents);
  }, [location.state]);
  console.log(events);
  const handleFilterChange = (filteredEvents) => {
    setEvents(filteredEvents);
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 250);
  }, []);
  return loading ? (
    <div className="flex justify-center items-center h-screen">
      <Loader />
    </div>
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
      <div className="flex flex-col md:flex-row gap-2 p-5">
        <div className="w-full md:w-1/4">
          <FilterSidebar onFilterChange={handleFilterChange} />
        </div>
        <div className="w-full md:w-3/4 overflow-y-auto">
          {events.length > 0 ? (
            <EventList event={events} />
          ) : (
            <p className="text-gray-500">Không tìm thấy sự kiện nào.</p>
          )}
       
        </div>
      </div>
      
    </div>
    <Footer />;
    </>
  );
};


export default SearchPage;
