import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import Loader from "./Loading";
import { useAuth } from "../pages/Auth/AuthProvider";
import FavoriteButton from "./FavoriteButton";
import { CiCalendarDate, CiTimer, CiLocationOn } from "react-icons/ci";
import { FaEye } from "react-icons/fa6";
import { useTranslation } from "react-i18next"; // Import useTranslation

const ListEventScroll = ({ apiUrl, title, t }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  const fetchEvents = async () => {
    try {
      const response = await fetch(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(t("recommendedEvents.error", { message: "Failed to fetch events" }));
      }
      const data = await response.json();
      setEvents(Array.isArray(data) ? data : [...data]);
    } catch (error) {
      setError(error.message);
      console.error(`Error fetching events from ${apiUrl}:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchEvents();
    } else {
      setLoading(false);
    }
  }, [apiUrl, t]); // Add t to dependencies

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

  const getLocation = (location) => {
    if (!location || (!location.venueName && !location.address && !location.city)) {
      return t("eventListSearch.online"); // Translated "Online"
    }
    const parts = [
      location.venueName,
      location.address,
      location.city,
    ].filter((part) => part && part.trim() !== "");
    return parts.length > 0 ? parts.join(", ") : t("eventListSearch.online");
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
        {t("recommendedEvents.error", { message: error })} {/* Translated error */}
      </div>
    );
  }

  if (!events || events.length === 0) {
    return <></>;
  }

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-4 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 font-montserrat">
          {title}
        </h2>
        <div
          className="flex items-center gap-1 sm:gap-2 hover:cursor-pointer hover:text-red-500"
          onClick={() => navigate("/all-event")}
        >
          <p className="text-xs sm:text-sm lg:text-[15px] text-gray-600 hover:text-red-500">
            {t("recommendedEvents.viewAllEvents")} {/* Translated "View all events" */}
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
            <div className="w-full h-32 sm:h-36 lg:h-40 bg-gray-100 rounded-t-lg overflow-hidden">
              {event.eventImages && event.eventImages.length > 0 ? (
                <div
                  className="relative w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${event.eventImages[0]})` }}
                >
                  {user && <FavoriteButton eventId={event.eventId} />}
                </div>
              ) : (
                <img
                  src="https://via.placeholder.com/300x150"
                  alt={t("eventListSearch.noImages")} // Translated alt text
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div className="p-3 sm:p-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                {truncateText(event.eventName, 25) || t("recommendedEvents.noDescription")} {/* Fallback */}
              </h3>
              <p
                className="text-gray-600 text-xs sm:text-sm mt-1"
                dangerouslySetInnerHTML={{
                  __html: event?.eventDesc
                    ? sanitizeAndTruncate(event.eventDesc, 30)
                    : t("recommendedEvents.noDescription"), // Translated fallback
                }}
              />
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
                  {t("recommendedEvents.noDescription")} {/* Fallback for no tags */}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RecommendedEvents = () => {
  const { user } = useAuth();
  const email = user?.email;
  const { t } = useTranslation();   
  return (
    <div className="w-full">
      <ListEventScroll
        apiUrl={`http://localhost:8080/api/events/recommended/${email}`}
        title={t('recommendedEvents.youMightLike')}
        t = {t}
      />
      <ListEventScroll
        apiUrl={`http://localhost:8080/api/events/recommended/by-types/${email}`}
        title={t('recommendedEvents.somePopularEvents')}
        t = {t}
      />
    </div>
  );
};

export default RecommendedEvents;