import { useState, useEffect } from "react";
import styled from "styled-components";
import Loader from "../../components/Loading";
// Hàm rút gọn văn bản
const truncateText = (text, maxLength) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};


const EventGrid = ({ events, onEventClick }) => {
  const [displayedEvents, setDisplayedEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const eventsPerPage = 4;

  
  useEffect(() => {
    const initialEvents = events.slice(0, 8); 
    setDisplayedEvents(initialEvents);
    setPage(3); 
  }, [events]);

  // Xử lý khi nhấp vào View More
  const handleViewMore = () => {
    setIsLoading(true);

    
    setTimeout(() => {
      const startIndex = (page - 1) * eventsPerPage;
      const endIndex = startIndex + eventsPerPage;
      const newEvents = events.slice(0, endIndex);
      setDisplayedEvents(newEvents);
      setPage((prevPage) => prevPage + 1);
      setIsLoading(false);
    }, 1000); 
  };

  return (
    <div className="container mx-auto px-8 py-4 relative">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Events</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedEvents.map((event) => (
          <div
            key={event.eventId}
            onClick={() => onEventClick(event.eventId)}
            className="max-w-[300px] min-h-[400px] bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg hover:bg-gray-100 cursor-pointer transition-shadow"
          >
            {/* Hình ảnh sự kiện */}
            <div className="w-full h-40 bg-gray-100 rounded-t-lg overflow-hidden">
              {event.eventImages && event.eventImages.length > 0 ? (
                <img
                  src={event.eventImages[0]}
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
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {truncateText(event.eventName, 25) || "Unnamed Event"}
              </h3>
              <p className="text-gray-600 text-sm mt-1 truncate">
                {truncateText(event.eventDesc, 30) || "No description"}
              </p>
              <p className="text-gray-700 text-sm mt-2">
                <span className="font-medium">Ngày:</span>{" "}
                {new Date(event.eventStart).toLocaleDateString("vi-VN")}
              </p>
              <p className="text-gray-700 text-sm">
                <span className="font-medium">Thời gian:</span>{" "}
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
              <p className="text-gray-700 text-sm mt-1 truncate">
                <span className="font-medium">Địa điểm:</span>{" "}
                {truncateText(event.eventLocation, 25) || "Không có địa điểm"}
              </p>
            </div>

            {/* Tags */}
            <div className="px-4 pb-4 flex flex-wrap gap-2">
              {event.tags && typeof event.tags === "string" ? (
                event.tags.split("|").map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                  >
                    {truncateText(tag.trim(), 10)}
                  </span>
                ))
              ) : (
                <span className="text-gray-600 text-xs">Không có tag</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Hiển thị nút View More hoặc Loader */}
      {displayedEvents.length < events.length && (
        <div className="flex justify-center mt-6">
          {isLoading ? (
            <Loader />
          ) : (
            <button
              onClick={handleViewMore}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Xem thêm
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EventGrid;