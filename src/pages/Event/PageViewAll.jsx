import { useState, useEffect } from "react";
import Loader from "../../components/Loading";
import Footer from "../../components/Footer";
// Hàm rút gọn văn bản
const truncateText = (text, maxLength) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const AllEvent = ({ onEventClick }) => {
  const [events, setEvents] = useState([]);
  const [displayedEvents, setDisplayedEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const eventsPerPage = 4;
  const token = localStorage.getItem("token");

  const fetchAllEvents = async () => {
    if (!token) {
      setError("Không tìm thấy token xác thực");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8080/api/events/all", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Không thể tải danh sách sự kiện");
      }
      const data = await response.json();
      setEvents(data);
      setDisplayedEvents(data.slice(0, eventsPerPage)); // Hiển thị trang đầu tiên
    } catch (error) {
      setError(error.message);
      console.error("Lỗi khi tải sự kiện:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEvents();
  }, []);

  const handleViewMore = () => {
    if (displayedEvents.length >= events.length) return;

    setIsLoading(true);

    setTimeout(() => {
      const startIndex = page * eventsPerPage;
      const endIndex = startIndex + eventsPerPage;
      const newEvents = events.slice(startIndex, endIndex);
      setDisplayedEvents((prevEvents) => [...prevEvents, ...newEvents]);
      setPage((prevPage) => prevPage + 1);
      setIsLoading(false);
    }, 400); // Hiển thị Loader trong 0.4 giây
  };

  if (isLoading && displayedEvents.length === 0) {
    return (
      <div className="text-center p-4">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-600">
        Lỗi: {error}. Vui lòng thử lại sau.
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center p-4 text-gray-600">
        Không có sự kiện nào để hiển thị.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-8 py-4 relative">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">All event</h2>
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
                {truncateText(event.eventName, 25) || "Sự kiện không tên"}
              </h3>
              <p className="text-gray-600 text-sm mt-1 truncate">
                {truncateText(event.eventDesc, 30) || "Không có mô tả"}
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
                {truncateText(event.eventLocation?.city, 25) || "Không có địa điểm"}
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

      {/* Nút View More hoặc Loader */}
      {displayedEvents.length < events.length && (
        <div className="flex justify-center mt-6">
          {isLoading ? (
            <Loader />
          ) : (
            <button
              onClick={handleViewMore}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              View More
            </button>
          )}
        </div>
      )}
      <Footer/>
    </div>
  );
};

export default AllEvent;