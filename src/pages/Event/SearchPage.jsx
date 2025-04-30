import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import EventList from "../../components/EventListSearch";
import Footer from "../../components/Footer";
import Loader from "../../components/Loading";

const FilterSidebar = ({ onFilterChange, selectedCategories, setSelectedCategories, 
  selectedEventLocation, setSelectedEventLocation }) => {
  const eventCategories = [
    { id: "all-types", label: "All types" },
    { id: "conference", label: "Conference" },
    { id: "workshop", label: "Workshop" },
    { id: "seminar", label: "Seminar" },
    { id: "concert", label: "Concert" },
    { id: "exhibition", label: "Exhibition" },
  ];

  const eventLocations = [
    { id: "all-locations", label: "All location" },
    { id: "ha-noi", label: "Hà Nội" },
    { id: "ho-chi-minh", label: "TP. Hồ Chí Minh" },
    { id: "da-nang", label: "Đà Nẵng" },
  ];

  return (
    <div className="w-full bg-white p-6 rounded-[4px] space-y-8 border-r border-gray-200">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">Filters</h2>
        <button
          onClick={() => {
            setSelectedCategories("all-types");
            setSelectedEventLocation("all-locations");
            onFilterChange([]);
          }}
          className="text-red-500 hover:text-red-700 font-semibold transition-colors duration-200 text-[13px]"
        >
          Delete filter
        </button>
      </div>

      <div>
        <h3 className="font-semibold text-gray-700 mb-3 text-lg">Event types</h3>
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
        <h3 className="font-semibold text-gray-700 mb-3 text-lg">Location</h3>
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
  const [selectedCategories, setSelectedCategories] = useState("all-types");
  const [selectedEventLocation, setSelectedEventLocation] = useState("all-locations");
  const location = useLocation();
  const [searchTitle, setSearchTitle] = useState(location.state?.searchTerm || "");
  const token = localStorage.getItem('token')
  useEffect(() => {
    // Lấy dữ liệu events từ state được truyền từ SearchBar
    const initialEvents = location.state?.events || [];
    setEvents(initialEvents);
    window.scrollTo(0, 0);
  }, [location.state]);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        let fetchedEvents = [];
        
        // Fetch events by category
        if (selectedCategories !== "all-types") {
          const response = await fetch(`http://localhost:8080/api/events/search/by-type/${selectedCategories}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }});
          if (!response.ok) throw new Error("Failed to fetch events by category");
          fetchedEvents = await response.json();
        } else {
          // If "all-types" is selected, fetch all events (assuming an endpoint for all events)
          const response = await fetch(`http://localhost:8080/api/events/search/by-type/all-types`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }});
          if (!response.ok) throw new Error("Failed to fetch all events");
          fetchedEvents = await response.json();
        }

        // Filter by location if a specific location is selected
        if (selectedEventLocation !== "all-locations") {
          const response = await fetch(`http://localhost:8080/api/events/search/by-city/${selectedEventLocation}`);
          if (!response.ok) throw new Error("Failed to fetch events by location");
          const locationEvents = await response.json();
          
          fetchedEvents = fetchedEvents.filter(event =>
            locationEvents.some(locEvent => locEvent.id === event.id)
          );
        }

        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [selectedCategories, selectedEventLocation]);

  const handleFilterChange = (filteredEvents) => {
    setEvents(filteredEvents);
  };

  return loading ? (
    <div className="flex justify-center items-center h-screen">
      <Loader />
    </div>
  ) : (
    <>
      <div className="mx-auto px-6 py-4">
        <h1 className="text-3xl font-bold text-gray-700 mt-4">
          {searchTitle ? `Upcoming Events for ${searchTitle}` : "Upcoming Events"}
        </h1>
        <div className="flex flex-col md:flex-row gap-2 p-5">
          <div className="w-full md:w-1/4">
            <FilterSidebar
              onFilterChange={handleFilterChange}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              selectedEventLocation={selectedEventLocation}
              setSelectedEventLocation={setSelectedEventLocation}
            />
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
      <Footer />
    </>
  );
};

export default SearchPage;