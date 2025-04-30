import Loader from "./Loading";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { Link } from "react-router-dom";
const ListEventScroll = () => {
  const [events, setEvents] = useState([]);
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
      setEvents(data);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };
  // Hàm cắt ngắn chuỗi với dấu "..."
  const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text || "";
    return text.substring(0, maxLength) + "...";
  };
  
  useEffect(() => {
    fetchAllEvent();
  }, []);

  
  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`); 
  };

  const handlePageAll = () =>{
    setLoading(true); 
    setTimeout(() => {
      navigate("/all-event"); 
    },250);
  };
  
  if (loading) {
    return (
      <div className="text-center p-4">
        <Loader/>
      </div>
    );
  }

 
  if (error) {
    return (
      <div className="text-center p-4 text-red-600">
        Error: {error}. Please try again later.
      </div>
    );
  }

 
  if (!events || events.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-600">No events available</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1280px]  mx-auto px-8 py-4 relative">
      <div className="flex justify-between">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Events</h2>
      <div className="flex items-center gap-2 hover:cursor-pointer hover:text-red-500" onClick={handlePageAll}>
      <p className="text-[15px] text-gray-600 hover:text-red-500">
        View all event
      </p>
      <i className="fa-solid fa-circle-chevron-right "></i>
    </div>
      </div>
      <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        {events.map((event) => (
          <div
            key={event.eventId}
            onClick={() => handleEventClick(event.eventId)} 
            className="max-w-[300px] min-h-[400px] bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg  hover:bg-gray-100 cursor-pointer transition-shadow cursor-pointer"
          >
            {/* Hình ảnh sự kiện */}
            <div className="w-full h-40 bg-gray-100 rounded-t-lg overflow-hidden">
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
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
              {truncateText(event.eventName, 25) || "Unnamed Event"}
              </h3>
              <p className="text-gray-600 text-sm mt-1 truncate">
              {truncateText(event.eventDesc, 30) || "No description"}
              </p>
              <p className="text-gray-700 text-sm mt-2">
                <span className="font-medium">Date:</span>{" "}
                {new Date(event.eventStart).toLocaleDateString("vi-VN")}
              </p>
              <p className="text-gray-700 text-sm">
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
              <p className="text-gray-700 text-sm mt-1 truncate">
                <span className="font-medium">Location:</span>{" "}
                {/* {truncateText(event.eventLocation, 25) || "No location"} */}
                {event.eventLocation.venueName +" "+ event.eventLocation.address +" "+ event.eventLocation.city}
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
                <span className="text-gray-600 text-xs">No tags</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListEventScroll;