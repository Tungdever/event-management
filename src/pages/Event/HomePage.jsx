import { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import SliderEvent from "../../components/SliderEvent";
import Footer from "../../components/Footer";
import { useRef } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaExternalLinkAlt,
} from "react-icons/fa";

import ListEventScroll from "../../components/EventListScroll";
import Loader from "../../components/Loading";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthProvider";


const ListEventGrid = ({ events: propEvents }) => {
  const [events, setLocalEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchAllEvent = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/events/all", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      setLocalEvents(data);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (propEvents && propEvents.length > 0) {
      setLocalEvents(propEvents);
      setLoading(false);
    } else {
      fetchAllEvent();
    }
  }, [propEvents]);

  const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text || "";
    return text.substring(0, maxLength) + "...";
  };

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  const handlePageAll = () => {
    setLoading(true);
    navigate("/all-event");
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-600 text-sm sm:text-base">
        Error: {error}. Please try again later.
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-600 text-sm sm:text-base">No events available</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
          Upcoming Events
        </h2>
        <div
          className="flex items-center gap-1 sm:gap-2 hover:cursor-pointer hover:text-red-500"
          onClick={handlePageAll}
        >
          <p className="text-xs sm:text-sm lg:text-[15px] text-gray-600 hover:text-red-500">
            View all event
          </p>
          <i className="fa-solid fa-circle-chevron-right text-xs sm:text-sm"></i>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {events.map((event) => (
          <div
            key={event.eventId}
            onClick={() => handleEventClick(event.eventId)}
            className="w-full min-h-[360px] sm:min-h-[380px] lg:min-h-[400px] bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg hover:bg-gray-100 cursor-pointer transition-shadow"
          >
            {/* Hình ảnh sự kiện */}
            <div className="w-full h-32 sm:h-36 lg:h-40 bg-gray-100 rounded-t-lg overflow-hidden">
              {event.eventImages && event.eventImages.length > 0 ? (
                <img
                  src={`${event.eventImages[0]}`}
                  alt={event.eventName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src="https://via.placeholder.com/300x150"
                  alt="Default Event"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Thông tin sự kiện */}
            <div className="p-3 sm:p-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                {truncateText(event.eventName, 25) || "Unnamed Event"}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm mt-1 truncate">
                {truncateText(event.eventDesc, 30) || "No description"}
              </p>
              <p className="text-gray-700 text-xs sm:text-sm mt-1 sm:mt-2">
                <span className="font-medium">Date:</span>{" "}
                {new Date(event.eventStart).toLocaleDateString("vi-VN")}
              </p>
              <p className="text-gray-700 text-xs sm:text-sm">
                <span className="font-medium">Time:</span>{" "}
                {new Date(event.eventStart).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                -{" "}
                {new Date(event.eventEnd).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-gray-700 text-xs sm:text-sm mt-1 truncate">
                <span className="font-medium">Location:</span>{" "}
                {event.eventLocation.venueName +
                  " " +
                  event.eventLocation.address +
                  " " +
                  event.eventLocation.city}
              </p>
            </div>

            {/* Tags */}
            <div className="px-3 sm:px-4 pb-3 sm:pb-4 flex flex-wrap gap-1 sm:gap-2">
              {event.tags && typeof event.tags === "string" ? (
                event.tags.split("|").map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 text-[10px] sm:text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded-full"
                  >
                    {truncateText(tag.trim(), 10)}
                  </span>
                ))
              ) : (
                <span className="text-gray-600 text-[10px] sm:text-xs">
                  No tags
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const popularCities = [
  {
    key: "ho-chi-minh",
    name: "Tp.Hồ Chí Minh",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/f/f4/Ho_Chi_Minh_City_panorama_2019_%28cropped2%29.jpg",
  },
  {
    key: "ha-noi",
    name: "Hà Nội",
    image:
      "https://tse4.mm.bing.net/th?id=OIP.TG6asWNB6eXi1qmyBhK0MgHaE8&pid=Api",
  },
  {
    key: "da-nang",
    name: "Đà Nẵng",
    image:
      "https://tse3.mm.bing.net/th?id=OIP.-VeJDm4d4pGItJ2dW1sPhwHaEW&pid=Api",
  },
  {
    key: "hoi-an",
    name: "Hội An",
    image:
      "https://tse1.mm.bing.net/th?id=OIP.yaHI0xalsVOhjJrMLgwd0gHaEj&pid=Api",
  },
  {
    key: "nha-trang",
    name: "Nha Trang",
    image:
      "https://tse3.mm.bing.net/th?id=OIP.lmOSh4__DVScQiGPX_z8gAHaE7&pid=Api",
  },
  {
    key: "da-lat",
    name: "Đà Lạt",
    image:
      "https://tse1.mm.bing.net/th?id=OIP.28LZalVpUhcZFkoxUzgPSAHaFj&pid=Api",
  },
  {
    key: "hue",
    name: "Huế",
    image:
      "https://tse2.mm.bing.net/th?id=OIP.GjTvs6qKXyVBVqZEr_28xgHaJQ&pid=Api",
  },
  {
    key: "phu-quoc",
    name: "Phú Quốc",
    image:
      "https://tse3.mm.bing.net/th?id=OIP.iD5WJa5kTTqnP83rCyg72QHaE7&pid=Api",
  },
  {
    key: "sa-pa",
    name: "Sa Pa",
    image:
      "https://tse3.mm.bing.net/th?id=OIP.vhiR4v7kpNaiZ2JBTogiewHaE8&pid=Api",
  },
  {
    key: "can-tho",
    name: "Cần Thơ",
    image:
      "https://tse3.mm.bing.net/th?id=OIP.3QDMqoVp2iw0o9c82hgDQgHaEK&pid=Api",
  },
  {
    key: "haiphong",
    name: "Hải Phòng",
    image:
      "https://tse2.mm.bing.net/th?id=OIP.5LC-cqmLjYiCVWjENF7hbAHaFK&pid=Api",
  },
];

const Navbar = ({ setCityEvents }) => {
  const [selectedLocation, setSelectedLocation] = useState("All location");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const token = localStorage.getItem("token");

  const locations = [
    { slug: "ho-chi-minh", name: "TP. Hồ Chí Minh" },
    { slug: "ha-noi", name: "Hà Nội" },
    { slug: "da-nang", name: "Đà Nẵng" },
  ];

  const fetchEventsByCity = async (citySlug) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/events/search/by-city/${citySlug}`);
      if (!response.ok) {
        throw new Error("Failed to fetch events by city");
      }
      const data = await response.json();
      setCityEvents(data);
    } catch (error) {
      console.error("Error fetching events by city:", error);
      setCityEvents([]);
    }
  };

  return (
    <div className="bg-white w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-2">
      {/* Location Section */}
      <div className="flex items-center space-x-2 relative">
        <span className="text-xs sm:text-sm lg:text-lg font-semibold">
          Browsing events in
        </span>
        <div className="relative inline-block">
          <button
            className="text-blue-800 font-semibold rounded-md px-2 sm:px-3 lg:px-4 py-1 bg-white flex items-center justify-start w-[120px] sm:w-[150px] lg:w-[180px] text-xs sm:text-sm lg:text-base"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {selectedLocation}
            <i className="bi bi-chevron-down ml-1 sm:ml-2 text-blue-800 text-xs sm:text-sm"></i>
          </button>
          {isDropdownOpen && (
            <div className="absolute left-0 mt-1 w-[120px] sm:w-[150px] lg:w-[180px] bg-white shadow-lg border rounded-lg py-1 sm:py-2 z-10">
              {locations.map((location) => (
                <div
                  key={location.slug}
                  className={`px-2 sm:px-3 lg:px-4 py-1 sm:py-2 cursor-pointer flex justify-between items-center hover:bg-blue-100 transition duration-200 text-xs sm:text-sm ${
                    selectedLocation === location.name
                      ? "text-blue-800 font-semibold"
                      : "text-gray-700"
                  }`}
                  onClick={() => {
                    setSelectedLocation(location.name);
                    fetchEventsByCity(location.slug);
                    setIsDropdownOpen(false);
                  }}
                >
                  {location.name}
                  {selectedLocation === location.name && (
                    <i className="bi bi-check text-blue-800"></i>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TopDestinations = () => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
      scrollRef.current.scrollTo({
        left: scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleSearchByCity = async (city) => {
    try {
      const cityName = city.trim().toLowerCase();
      const response = await fetch(
        `http://localhost:8080/api/events/search/by-city/${cityName}`
      );
      const listevent = await response.json();
      navigate("/search", { state: { events: listevent } });
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  return (
    <div className="bg-gray-50 text-gray-900 w-full max-w-[1280px] mx-auto p-4 sm:p-6">
      <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-center mb-4 sm:mb-6">
        Top destinations in Viet Nam
      </h1>
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto space-x-3 sm:space-x-4 pb-4 scroll-smooth scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
        >
          {popularCities.map((dest, index) => (
            <div key={index} className="flex-none w-48 sm:w-56 lg:w-64">
              <div className="relative">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="rounded-lg w-full h-36 sm:h-40 lg:h-48 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-red-600 to-transparent p-2 sm:p-3 lg:p-4 rounded-b-lg">
                  <span className="text-white text-base sm:text-lg lg:text-xl font-bold">
                    {dest.name}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => scroll("left")}
          className="absolute top-1/2 -translate-y-1/2 left-0 bg-white rounded-full p-1 sm:p-2 lg:p-3 shadow-sm hover:bg-gray-100"
        >
          <FaChevronLeft className="text-xs sm:text-sm lg:text-base" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute top-1/2 -translate-y-1/2 right-0 bg-white rounded-full p-1 sm:p-2 lg:p-3 shadow-sm hover:bg-gray-100"
        >
          <FaChevronRight className="text-xs sm:text-sm lg:text-base" />
        </button>
      </div>
      <h2 className="text-base sm:text-lg lg:text-xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4">
        Popular cities
      </h2>
      <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4">
        {popularCities.map((city, index) => (
          <a
            key={index}
            onClick={() => handleSearchByCity(city.key)}
            className="bg-white rounded-full px-3 sm:px-4 py-1 sm:py-2 shadow-sm text-gray-900 flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm lg:text-base"
          >
            <span>Things to do in {city.name}</span>
            <FaExternalLinkAlt className="text-xs sm:text-sm" />
          </a>
        ))}
      </div>
    </div>
  );
};

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [cityEvents, setCityEvents] = useState([]);

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
    <div className="flex flex-col min-h-screen">
      <SliderEvent />
      <Navbar setCityEvents={setCityEvents} />
      <ListEventScroll events={cityEvents} setEvents={setCityEvents} />
      {/* <EventListings /> */}
      <ListEventGrid/>
      <TopDestinations />
      <Footer />
    </div>
  );
};
export default HomePage;
