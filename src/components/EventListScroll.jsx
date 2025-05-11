import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import Loader from "./Loading";
import { useAuth } from "../pages/Auth/AuthProvider";

const ListEventScroll = ({ events: propEvents }) => {
  const [events, setLocalEvents] = useState([]);
  const [favoriteEvents, setFavoriteEvents] = useState(new Set()); // Lưu danh sách eventId yêu thích
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
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

  const getFavorites = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/favorites/${user.userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch favorite events");
      }
      const data = await response.json();
      const favoriteEventIds = new Set(data.map(event => event.eventId));
      setFavoriteEvents(favoriteEventIds);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching favorite events:", error);
    }
  };

  const addFavorites = async (eventId) => {
    try {
      const favoriteEvent = {
        userId: user.userId,
        eventId: eventId,
      };
      const response = await fetch("http://localhost:8080/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(favoriteEvent),
      });
      if (!response.ok) {
        throw new Error("Failed to add favorite event");
      }
      setFavoriteEvents(prev => new Set(prev).add(eventId));
    } catch (error) {
      setError(error.message);
      console.error("Error adding favorite event:", error);
    }
  };

  const removeFavorites = async (eventId) => {
    try {
      const favoriteEvent = {
        userId: user.userId,
        eventId: eventId,
      };
      const response = await fetch("http://localhost:8080/api/favorites", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(favoriteEvent),
      });
      if (!response.ok) {
        throw new Error("Failed to remove favorite event");
      }
      setFavoriteEvents(prev => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        return newSet;
      });
    } catch (error) {
      setError(error.message);
      console.error("Error removing favorite event:", error);
    }
  };

  const toggleFavorite = (eventId) => {
    if (favoriteEvents.has(eventId)) {
      removeFavorites(eventId);
    } else {
      addFavorites(eventId);
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
      if (user) {
        await getFavorites();
      }
    };
    initializeEvents();
  }, [propEvents, user]);

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
    const parts = [
      location.venueName,
      location.address,
      location.city,
    ].filter((part) => part && part.trim() !== "");
    return parts.length > 0 ? parts.join(", ") : "Online";
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
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-4 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
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
      <div className="flex overflow-x-auto space-x-3 sm:space-x-4 pb-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        {events.map((event) => (
          <div
            key={event.eventId}
            onClick={() => handleEventClick(event.eventId)}
            className="flex-none w-64 sm:w-72 lg:max-w-[300px] min-h-[360px] sm:min-h-[380px] lg:min-h-[400px] bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg hover:bg-gray-100 cursor-pointer transition-shadow"
          >
            {/* Hình ảnh sự kiện */}
            <div className="w-full h-32 sm:h-36 lg:h-40 bg-gray-100 rounded-t-lg overflow-hidden">
              {event.eventImages && event.eventImages.length > 0 ? (
                <div
                  className="relative w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${event.eventImages[0]})` }}
                >
                  <i
                    className={`fa-heart text-white absolute bottom-2 right-2 text-[24px] p-2 rounded-full cursor-pointer ${
                      favoriteEvents.has(event.eventId)
                        ? "fa-solid bg-red-500"
                        : "fa-regular hover:bg-red-500"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation(); // Ngăn click vào icon kích hoạt handleEventClick
                      toggleFavorite(event.eventId);
                    }}
                  ></i>
                </div>
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
              <p
                className="text-gray-600 text-xs sm:text-sm mt-1"
                dangerouslySetInnerHTML={{
                  __html: event?.eventDesc
                    ? sanitizeAndTruncate(event.eventDesc, 30)
                    : "No description available",
                }}
              />
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
                {getLocation(event.eventLocation)}
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

export default ListEventScroll;