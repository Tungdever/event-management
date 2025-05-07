import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaEllipsisV, FaFileCsv } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loading";
import { useAuth } from "../Auth/AuthProvider";

const EventsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Events");
  const [filterStatus, setFilterStatus] = useState("public");
  const [events, setEvents] = useState([]);
  const [popupVisible, setPopupVisible] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State cho input tìm kiếm
  const token = localStorage.getItem("token");
  const popupRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const handleTabClick = (tab) => setActiveTab(tab);
  const togglePopup = (id) => setPopupVisible(popupVisible === id ? null : id);

  // Fetch dữ liệu ban đầu
  useEffect(() => {
    fetchEventData();
    window.scrollTo(0, 0);
  }, []);

  // Fetch lại khi filterStatus thay đổi
  useEffect(() => {
    fetchEventByStatus(filterStatus);
  }, [filterStatus]);

  const fetchEventData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/events/get-all-event-by-org/${user.email}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch event data");
      }
      const data = await response.json();
      setEvents(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error("Error fetching event data:", error);
      alert("Failed to load event data");
    } finally {
      setLoading(false);
    }
  };

  const fetchEventByName = async (name) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/events/search/by-name/${encodeURIComponent(name)}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch event data");
      }
      const data = await response.json();
      setEvents(Array.isArray(data) ? data : [data]); // Cập nhật danh sách sự kiện
    } catch (error) {
      console.error("Error fetching event data:", error);
      alert("Failed to load event data");
    } finally {
      setLoading(false);
    }
  };

  const fetchEventByStatus = async (status) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/events/search/by-status/${status}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch event data");
      }
      const data = await response.json();
      setEvents(Array.isArray(data) ? data : [data]); // Cập nhật danh sách sự kiện
    } catch (error) {
      console.error("Error fetching event data:", error);
      alert("Failed to load event data");
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action, eventId) => {
    if (action === "Edit event") {
      navigate(`/dashboard/event/detail/${eventId}`, { state: { eventId } });
    }
    setPopupVisible(null);
  };

  const handleSearchClick = () => {
    if (searchTerm.trim()) {
      fetchEventByName(searchTerm);
    } else {
      fetchEventData(); // Nếu không có từ khóa, lấy tất cả sự kiện
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setPopupVisible(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return loading ? (
    <div className="flex justify-center items-center h-screen">
      <Loader />
    </div>
  ) : (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#202C4B]">
        Events
      </h1>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 sm:mt-6 space-y-4 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm lg:text-[13px]">
        <div className="relative w-full sm:w-auto flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search events"
            className="w-full sm:w-[250px] lg:w-[400px] border border-gray-300 rounded-md py-1.5 sm:py-2 px-3 sm:px-4 text-xs sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={handleSearchClick}
            className="bg-gray-600 text-white p-2 rounded-md"
          >
            <FaSearch className="text-sm sm:text-base" />
          </button>
        </div>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <select
            className="bg-gray-600 text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm w-full sm:w-auto"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="public">Public</option>
            <option value="complete">Complete</option>
          </select>
          <button
            className="bg-orange-600 text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm w-full sm:w-auto"
            onClick={() => navigate("/createEvent")}
          >
            Create Event
          </button>
        </div>
      </div>
      <div className="mt-4 sm:mt-6 bg-white rounded-md shadow text-xs sm:text-sm lg:text-[14px]">
        <div className="hidden sm:flex items-center p-3 sm:p-4 border-b border-gray-200">
          <div className="w-1/2 text-gray-600">Event</div>
          <div className="w-1/6 text-gray-600">Sold</div>
          <div className="w-1/6 text-gray-600">Gross</div>
          <div className="w-1/6 text-gray-600">Status</div>
        </div>
        {events.map((event) => (
          <div
            key={event.eventId}
            className="flex flex-col sm:flex-row items-start sm:items-center p-3 sm:p-4 relative hover:bg-gray-100 border-b border-gray-200 sm:border-0"
          >
            <div className="w-full sm:w-1/2 flex items-center space-x-3 sm:space-x-4 text-xs sm:text-[13px] mb-2 sm:mb-0">
              {event.eventImages && event.eventImages.length > 0 ? (
                <img
                  src={event.eventImages[0]}
                  alt={event.eventName}
                  className="w-12 h-12 sm:w-14 h-14 lg:w-16 h-16 object-cover rounded-md"
                />
              ) : (
                <div className="w-12 h-12 sm:w-14 h-14 lg:w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                  <span className="text-gray-500 text-xs sm:text-sm">No Image</span>
                </div>
              )}
              <div>
                <h3 className="text-sm sm:text-base lg:text-[16px] font-semibold truncate">
                  {event.eventName}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm truncate">
                  {event.eventLocation.venueName}
                </p>
                <p className="text-gray-600 text-xs sm:text-sm">{event.eventType}</p>
              </div>
            </div>
            <div className="w-full sm:w-1/6 text-gray-600 flex sm:block mb-2 sm:mb-0">
              <span className="sm:hidden font-semibold mr-2">Sold:</span>0
            </div>
            <div className="w-full sm:w-1/6 text-gray-600 flex sm:block mb-2 sm:mb-0">
              <span className="sm:hidden font-semibold mr-2">Gross:</span>0
            </div>
            <div className="w-full sm:w-1/6 text-gray-600 flex sm:block">
              <span className="sm:hidden font-semibold mr-2">Status:</span>
              {event.eventStatus}
            </div>
            <div className="ml-auto relative">
              <FaEllipsisV
                className="text-gray-600 cursor-pointer text-sm sm:text-base"
                onClick={() => togglePopup(event.eventId)}
              />
              {popupVisible === event.eventId && (
                <div
                  ref={popupRef}
                  className="absolute right-0 mt-2 w-40 sm:w-44 lg:w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10"
                >
                  {["Edit event", "Delete event"].map((action) => (
                    <div
                      key={action}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 text-gray-700 hover:bg-gray-100 cursor-pointer text-xs sm:text-sm"
                      onClick={() => handleActionClick(action, event.eventId)}
                    >
                      {action}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="min-h-screen">
      <EventsPage />
    </div>
  );
};

export default Dashboard;