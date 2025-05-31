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
  eventCategories, // Nhận eventCategories từ props
}) => {
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
    <div className="w-full bg-white p-6 rounded-[4px] space-y-8 border-r border-gray-200">
      <div className="flex items-center justify-between pb-4 border-b">
        <h2 className="text-xl font-bold text-gray-800">Filters</h2>
      </div>

      <div>
        <h3 className="mb-3 text-lg font-semibold text-gray-700">Event types</h3>
        {eventCategories.length === 0 ? (
          <p className="text-sm text-gray-500">Loading event types...</p>
        ) : (
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
                  checked={selectedCategories === category.label}
                  onChange={() => setSelectedCategories(category.label)}
                  className="w-4 h-4 border-2 border-orange-500 accent-red-500"
                />
                <label
                  htmlFor={category.id}
                  className="text-gray-600 transition-colors duration-200 cursor-pointer hover:text-red-500"
                >
                  {category.label}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-3 text-lg font-semibold text-gray-700">Location</h3>
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
                className="text-gray-600 transition-colors duration-200 cursor-pointer hover:text-red-500"
              >
                {location.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-lg font-semibold text-gray-700">Time</h3>
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
                className="text-gray-600 transition-colors duration-200 cursor-pointer hover:text-red-500"
              >
                {time.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-lg font-semibold text-gray-700">Price</h3>
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
                className="text-gray-600 transition-colors duration-200 cursor-pointer hover:text-red-500"
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
  const [selectedEventLocation, setSelectedEventLocation] = useState("all-locations");
  const [selectedEventStart, setSelectedEventStart] = useState("all-times");
  const [selectedTicketType, setSelectedTicketType] = useState("all-types");
  const [eventCategories, setEventCategories] = useState([{ id: "all-types", label: "All types" }]); // Khởi tạo với "All types"
  const [loadingCategories, setLoadingCategories] = useState(true); // Trạng thái loading cho event types
  const location = useLocation();
  const [searchTitle, setSearchTitle] = useState(location.state?.searchTerm || "");
  const token = localStorage.getItem("token");

  // Lấy danh sách event types từ API
  useEffect(() => {
    const fetchEventTypes = async () => {
      setLoadingCategories(true);
      try {
        const response = await fetch("http://localhost:8080/api/events-type/get-all-event-types", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch event types");
        const data = await response.json();
        // Giả định dữ liệu API trả về dạng: [{ eventTypeId: number, eventTypeName: string }, ...]
        const formattedCategories = [
          { id: "all-types", label: "All types" }, // Giữ tùy chọn "All types"
          ...data.map((type) => ({
            id: type.id, // Sử dụng eventTypeName làm id
            label: type.typeName, // Sử dụng eventTypeName làm label
          })),
        ];
        setEventCategories(formattedCategories);
      } catch (error) {
        console.error("Error fetching event types:", error);
        // Giữ "All types" nếu API thất bại
        setEventCategories([{ id: "all-types", label: "All types" }]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchEventTypes();
  }, [token]);

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

  return loading || loadingCategories ? (
    <div className="flex items-center justify-center h-screen">
      <Loader />
    </div>
  ) : (
    <>
      <div className="px-6 py-4 mx-auto">
        <h1 className="mt-4 text-3xl font-bold text-gray-700 font-montserrat">
          {searchTitle
            ? `Upcoming events for ${searchTitle}`
            : "Upcoming events"}
        </h1>
        <div className="flex flex-col gap-2 p-5 md:flex-row">
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
              eventCategories={eventCategories} // Truyền eventCategories vào FilterSidebar
            />
          </div>
          <div className="w-full md:w-3/4">
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