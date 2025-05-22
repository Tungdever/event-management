import { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import Loader from "./Loading";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../pages/Auth/AuthProvider";
import DOMPurify from "dompurify";
import FavoriteButton from "./FavoriteButton";
import { CiCalendarDate, CiTimer, CiLocationOn } from "react-icons/ci";
import { FaEye } from "react-icons/fa6";

const ListEventGrid = ({ events: propEvents }) => {
  const [events, setLocalEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  const fetchAllEvent = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/events/search/upcoming", {
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
    const initializeEvents = async () => {
      if (propEvents && propEvents.length > 0) {
        setLocalEvents(propEvents);
        setLoading(false);
      } else {
        await fetchAllEvent();
      }
    };
    initializeEvents();
  }, [propEvents]);

  const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text || "";
    return text.substring(0, maxLength) + "...";
  };

  const sanitizeAndTruncate = (html, maxLength) => {
    const sanitizedHtml = DOMPurify.sanitize(html || "");
    const plainText = sanitizedHtml.replace(/<[^>]+>/g, "");
    if (plainText.length <= maxLength) {
      return sanitizedHtml;
    }
    const truncatedPlainText = truncateText(plainText, maxLength);
    return `<p>${truncatedPlainText}</p>`;
  };

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  const handlePageAll = () => {
    setLoading(true);
    navigate("/all-event");
  };

  const getLocation = (location) => {
    if (!location || (!location.venueName && !location.address && !location.city)) {
      return "Online";
    }
    const parts = [location.venueName, location.address, location.city].filter(
      (part) => part && part.trim() !== ""
    );
    return parts.length > 0 ? parts.join(", ") : "Online";
  };

  if (loading) {
    return (
      <div className="text-center p-6">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 text-red-600 text-sm sm:text-base font-medium">
        Error: {error}. Please try again later.
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="text-center p-6">
        <p className="text-gray-600 text-sm sm:text-base font-medium">
          No events available
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 font-montserrat">
          Upcoming Events
        </h2>
        <button
          onClick={handlePageAll}
          className="flex items-center gap-2 text-sm sm:text-base text-gray-600 hover:text-red-600 transition duration-200"
        >
          <span>View all events</span>
          <i className="fa-solid fa-circle-chevron-right text-sm sm:text-base"></i>
        </button>
      </div>

      {/* Event Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {events.map((event) => (
          <div
            key={event.eventId}
            onClick={() => handleEventClick(event.eventId)}
            className="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
          >
            {/* Event Image */}
            <div className="relative w-full h-40 sm:h-48 bg-gray-100 overflow-hidden">
              {event.eventImages && event.eventImages.length > 0 ? (
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-102 transition-transform duration-300"
                  style={{ backgroundImage: `url(${event.eventImages[0]})` }}
                >
                  {user && <FavoriteButton eventId={event.eventId} />}
                </div>
              ) : (
                <img
                  src="https://via.placeholder.com/300x150?text=No+Image"
                  alt="Default Event"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
              )}
            </div>

            {/* Event Details */}
            <div className="p-4 sm:p-5">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 line-clamp-1">
                {truncateText(event.eventName, 30) || "Unnamed Event"}
              </h3>
              <p
                className="text-gray-600 text-sm mt-2 line-clamp-2"
                dangerouslySetInnerHTML={{
                  __html: event?.eventDesc
                    ? sanitizeAndTruncate(event.eventDesc, 60)
                    : "No description available",
                }}
              />
              <div className="mt-3 space-y-1 text-sm text-gray-700">
              <p className="text-gray-700 text-xs sm:text-sm mt-1 sm:mt-2">
                              <CiCalendarDate className="inline-block mr-1" />{" "}
                              {new Date(event.eventStart).toLocaleDateString("vi-VN")}
                            </p>
                            <p className="text-gray-700 text-xs sm:text-sm">
                              <CiTimer className="inline-block mr-1" />{" "}
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
                              <CiLocationOn className="inline-block mr-1" />{" "}
                              {getLocation(event.eventLocation)}
                            </p>
                            <p className="text-gray-700 text-xs sm:text-sm mt-1">
                              <FaEye className="inline-block mr-1" />{" "}
                              {event?.viewCount ? `${event.viewCount}` : "0"}
                            </p>
                          </div>
              
           
            </div>
              
            {/* Tags */}
            <div className="px-4 pb-4 flex flex-wrap gap-2">
              {event.tags && typeof event.tags === "string" ? (
                event.tags.split("|").map((tag, index) => (
                  <span
                    key={index}
                    className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full"
                  >
                    {truncateText(tag.trim(), 12)}
                  </span>
                ))
              ) : (
                <span className="text-gray-600 text-xs">No tags</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListEventGrid;