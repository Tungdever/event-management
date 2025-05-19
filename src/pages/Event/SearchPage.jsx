import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import EventList from "../../components/EventListSearch";
import Footer from "../../components/Footer";
import Loader from "../../components/Loading";

const FilterSidebar = ({
  onFilterChange,
  selectedCategories,
  setSelectedCategories,
  selectedEventLocation,
  setSelectedEventLocation,
  selectedEventStart,
  setSelectedEventStart,
  selectedTicketType,
  setSelectedTicketType,
}) => {
  const eventCategories = [
    { id: "all-types", label: "All types" },
    { id: "Conference", label: "Conference" },
    { id: "Food & Drink", label: "Food & Drink" },
    { id: "Business", label: "Business" },
    { id: "Hobbies", label: "Hobbies" },
    { id: "Dating", label: "Dating" },
    { id: "Holidays", label: "Holidays" },
    { id: "Performing", label: "Performing" },
    { id: "Nightlife", label: "Nightlife" },
    { id: "Music", label: "Music" },
  ];

  const eventLocations = [
    { id: "all-locations", label: "All location" },
    { id: "ho-chi-minh", label: "TP. Hồ Chí Minh" },
    { id: "ha-noi", label: "Hà Nội" },
    { id: "da-nang", label: "Đà Nẵng" },
    { id: "hai-phong", label: "Hải Phòng" },
    { id: "can-tho", label: "Cần Thơ" },
    { id: "nha-trang", label: "Nha Trang" },
    { id: "da-lat", label: "Đà Lạt" },
    { id: "binh-duong", label: "Bình Dương" },
    { id: "dong-nai", label: "Đồng Nai" },
    { id: "quang-ninh", label: "Quảng Ninh" },
  ];

  const eventStarts = [
    { id: "all-times", label: "All time" },
    { id: "this-week", label: "This week" },
    { id: "this-month", label: "This month" },
  ];
  const ticketTypes = [
    { id: "all-types", label: "All types" },
    { id: "Free", label: "Free" },
    { id: "Paid", label: "Paid" },
  ];

  return (
    <div className="w-full bg-white p-6 rounded-[4px] space-y-8 border-r border-gray-200 overflow-y-auto h-screen">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">Filters</h2>

      </div>

      <div>
        <h3 className="font-semibold text-gray-700 mb-3 text-lg">
          Event types
        </h3>
        <div className="space-y-3">
          {eventCategories.map((category) => (
            <div
              key={category.id}
              className="flex items-center space-x-3 text-[13px]"
            >
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
        <h3 className="font-semibold text-gray-700 mb-3 text-lg">Location</h3>
        <div className="space-y-3">
          {eventLocations.map((location) => (
            <div
              key={location.id}
              className="flex items-center space-x-3 text-[13px]"
            >
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

      <div>
        <h3 className="font-semibold text-gray-700 mb-3 text-lg">Time</h3>
        <div className="space-y-3">
          {eventStarts.map((time) => (
            <div
              key={time.id}
              className="flex items-center space-x-3 text-[13px]"
            >
              <input
                id={time.id}
                type="radio"
                name="eventStart"
                checked={selectedEventStart === time.id}
                onChange={() => setSelectedEventStart(time.id)}
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
        <h3 className="font-semibold text-gray-700 mb-3 text-lg">Price</h3>
        <div className="space-y-3">
          {ticketTypes.map((type) => (
            <div
              key={type.id}
              className="flex items-center space-x-3 text-[13px]"
            >
              <input
                id={type.id}
                type="radio"
                name="ticketType"
                checked={selectedTicketType === type.id}
                onChange={() => setSelectedTicketType(type.id)}
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
    </div>
  );
};

const SearchPage = () => {
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState("all-types");
  const [selectedEventLocation, setSelectedEventLocation] =
    useState("all-locations");
  const [selectedEventStart, setSelectedEventStart] = useState("all-times");
  const [selectedTicketType, setSelectedTicketType] = useState("all-types");
  const location = useLocation();
  const [searchTitle, setSearchTitle] = useState(
    location.state?.searchTerm || ""
  );
  const token = localStorage.getItem("token");

  // Thiết lập sự kiện ban đầu từ location.state
  useEffect(() => {
    const initialEvents = location.state?.events || [];
    setEvents(initialEvents);
    setSearchTitle(location.state?.searchTerm || "");
    window.scrollTo(0, 0);
  }, [location.state]);

  // Lấy dữ liệu khi bộ lọc thay đổi
  useEffect(() => {
    const fetchEvents = async () => {
      if (
        selectedCategories === "all-types" &&
        selectedEventLocation === "all-locations" &&
        selectedEventStart === "all-times" &&
        selectedTicketType === "all-types"
      ) {
        return; // Giữ nguyên events từ location.state
      }
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8080/api/events/search/multiple-filters?eventCategory=${selectedCategories}&eventLocation=${selectedEventLocation}&eventStart=${selectedEventStart}&ticketType=${selectedTicketType}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch events");
        const fetchedEvents = await response.json();
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
    window.scrollTo(0, 0);
  }, [
    selectedCategories,
    selectedEventLocation,
    selectedEventStart,
    selectedTicketType,
    token,
  ]);

  return loading ? (
    <div className="flex justify-center items-center h-screen">
      <Loader />
    </div>
  ) : (
    <>
     <div 
        className="mx-auto px-6 py-4">
        <h1 className="text-3xl font-bold text-gray-700 mt-4 font-montserrat">
          {searchTitle
            ? `Upcoming events for ${searchTitle}`
            : "Upcoming events"}
        </h1>
        <div className="flex flex-col md:flex-row gap-2 p-5">
          <div className="w-full md:w-1/4">
            <FilterSidebar
              onFilterChange={(filteredEvents) => setEvents(filteredEvents)}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              selectedEventLocation={selectedEventLocation}
              setSelectedEventLocation={setSelectedEventLocation}
              selectedEventStart={selectedEventStart}
              setSelectedEventStart={setSelectedEventStart}
              selectedTicketType={selectedTicketType}
              setSelectedTicketType={setSelectedTicketType}
            />
          </div>
          <div className="w-full md:w-3/4 overflow-y-auto h-screen">
            {events.length > 0 ? (
              <EventList event={events} />
            ) : (
              <p className="text-gray-500">No event found.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SearchPage;
