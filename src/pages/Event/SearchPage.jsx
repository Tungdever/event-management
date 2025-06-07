import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import EventList from "../../components/EventListSearch";
import Footer from "../../components/Footer";
import Loader from "../../components/Loading";
import { useTranslation } from "react-i18next";
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
  eventCategories,
  t
}) => {
  const eventLocations = [
    { id: "all-locations", label: t("searchPage.allLocations") },
    { id: "ho-chi-minh", label: t("searchPage.locations.hoChiMinh") },
    { id: "ha-noi", label: t("searchPage.locations.haNoi") },
    { id: "da-nang", label: t("searchPage.locations.daNang") },
    { id: "hai-phong", label: t("searchPage.locations.haiPhong") },
    { id: "can-tho", label: t("searchPage.locations.canTho") },
    { id: "nha-trang", label: t("searchPage.locations.nhaTrang") },
    { id: "da-lat", label: t("searchPage.locations.daLat") },
    { id: "binh-duong", label: t("searchPage.locations.binhDuong") },
    { id: "dong-nai", label: t("searchPage.locations.dongNai") },
    { id: "quang-ninh", label: t("searchPage.locations.quangNinh") },
  ];

  const eventStarts = [
    { id: "all-times", label: t("searchPage.allTimes") },
    { id: "this-week", label: t("searchPage.thisWeek") },
    { id: "this-month", label: t("searchPage.thisMonth") },
  ];

  const ticketTypes = [
    { id: "all-types", label: t("searchPage.allTicketTypes") },
    { id: "Free", label: t("searchPage.free") },
    { id: "Paid", label: t("searchPage.paid") },
  ];
  const formatLabel = (label) => {
    if (!label) return "Unknown";
    return label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
  };
  const getCategoryLabel = (label, id) => {
    if (id === "all-types") {
      return t("searchPage.allTypes"); // Use searchPage.allTypes for "All types"
    }
    const translationKey = `sliderEvent.${label.toLowerCase()}`;
    const translated = t(translationKey);
    // If translation is the same as the key, it means the key is missing
    if (translated === translationKey) {
      console.warn(`Missing translation for: ${translationKey}`);
      return formatLabel(label); // Fallback to formatted label
    }
    return translated;
  };
  return (
    <div className="w-full bg-white p-6 rounded-[4px] space-y-8 border-r border-gray-200">
      <div className="flex items-center justify-between pb-4 border-b">
        <h2 className="text-xl font-bold">{t("searchPage.filters")}</h2>
      </div>

      <div>
        <h3 className="mb-3 text-lg font-semibold">{t("searchPage.eventTypes")}</h3>
        {eventCategories.length === 0 ? (
          <p className="text-sm text-gray-500">{t("searchPage.loadingEventTypes")}</p>
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
                  {getCategoryLabel(category.label, category.id)}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">{t("searchPage.location")}</h3>
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
        <h3 className="mb-4 text-lg font-semibold">{t("searchPage.time")}</h3>
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
        <h3 className="mb-4 text-lg font-semibold">{t("searchPage.price")}</h3>
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
  const { t } = useTranslation();
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
          { id: "all-types", label: t("searchPage.allTypes") }, // Giữ tùy chọn "All types"
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
            ? t("searchPage.upcomingEventsFor", { searchTerm: searchTitle })
            : t("searchPage.upcomingEvents")}
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
              eventCategories={eventCategories}
              t={t}
            />
          </div>
          <div className="w-full md:w-3/4">
            {events.length > 0 ? (
              <EventList event={events} />
            ) : (
              <p className="text-gray-500">{t("searchPage.noEvents")}</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SearchPage;