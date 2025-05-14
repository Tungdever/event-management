import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaEllipsisV, FaFileCsv } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loading";
import { useAuth } from "../Auth/AuthProvider";

const EventsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Events");
  const [filterStatus, setFilterStatus] = useState("");
  const [events, setEvents] = useState([]);
  const [popupVisible, setPopupVisible] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 4;
  const token = localStorage.getItem("token");
  const popupRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const handleTabClick = (tab) => setActiveTab(tab);
  const togglePopup = (id) => setPopupVisible(popupVisible === id ? null : id);

  useEffect(() => {
    if (user?.email && token) {
      fetchEventData();
      window.scrollTo(0, 0);
    }
  }, [user?.email, token]);

  const fetchEventData = async () => {
    setLoading(true);
    try {
      console.log("Fetching events for email:", user.email);
      console.log("Using token:", token);
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
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("API response (get-all-event-by-org):", data);
      setEvents(Array.isArray(data) ? data : []);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching event data:", error);
      alert("Không thể tải dữ liệu sự kiện");
    } finally {
      setLoading(false);
    }
  };

  const filterEventsByStatus = (events, status) => {
    if (!status) {
      return events;
    }
    return events.filter(
      (event) =>
        event.eventStatus &&
        event.eventStatus.toLowerCase() === status.toLowerCase()
    );
  };

  const searchEventsByName = (events, searchTerm) => {
    if (!searchTerm.trim()) {
      return events;
    }
    return events.filter(
      (event) =>
        event.eventName &&
        event.eventName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleActionClick = (action, eventId) => {
    if (action === "Xem chi tiết sự kiện") {
      navigate(`/dashboard/event/detail/${eventId}`, { state: { eventId } });
    }
    setPopupVisible(null);
  };

  const handleSearchClick = () => {
    setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
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

  const searchedEvents = searchEventsByName(events, searchTerm);
  const filteredEvents = filterEventsByStatus(searchedEvents, filterStatus);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return loading ? (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-teal-50 to-gray-100">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-teal-500"></div>
    </div>
  ) : (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100 py-12 font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-800 mb-8">
          Events
        </h1>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="relative w-full sm:w-auto flex items-center space-x-3">
            <input
              type="text"
              placeholder="Tìm kiếm sự kiện"
              className="w-full sm:w-96 bg-white border border-gray-200 rounded-lg py-3 px-4 text-sm shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={handleSearchClick}
              className="bg-teal-500 text-white p-3 rounded-lg shadow-md hover:bg-teal-600 transition-colors duration-300"
            >
              <FaSearch className="text-base" />
            </button>
          </div>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <select
              className="bg-teal-500 text-white py-3 px-4 rounded-lg text-sm shadow-sm hover:bg-teal-600 transition-colors duration-300"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All</option>
              <option value="public">Public</option>
              <option value="complete">Complete</option>
            </select>
            <button
              className="bg-orange-500 text-white py-3 px-4 rounded-lg text-sm shadow-sm hover:bg-orange-600 transition-colors duration-300"
              onClick={() => navigate("/createEvent")}
            >
              Create event
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="hidden sm:grid sm:grid-cols-12 gap-4 p-6 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600">
            <div className="col-span-5">Events</div>
            <div className="col-span-2"></div>
            <div className="col-span-2"></div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1"></div>
          </div>
          {currentEvents.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Not found event
            </div>
          ) : (
            currentEvents.map((event) => (
              <div
                key={event.eventId}
                className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 sm:p-6 border-b border-gray-200 hover:bg-teal-50 transition-colors duration-300"
              >
                <div className="col-span-1 sm:col-span-5 flex items-center space-x-4">
                  {event.eventImages && event.eventImages.length > 0 ? (
                    <img
                      src={event.eventImages[0]}
                      alt={event.eventName}
                      className="w-16 h-16 sm:w-20 h-20 object-cover rounded-lg shadow-sm"
                    />
                  ) : (
                    <div className="w-16 h-16 sm:w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center shadow-sm">
                      <span className="text-gray-500 text-xs sm:text-sm">No image</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                      {event.eventName}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm truncate">
                      {event.eventLocation.venueName}
                    </p>
                    <p className="text-gray-600 text-xs sm:text-sm">{event.eventType}</p>
                  </div>
                </div>
                <div className="col-span-1 sm:col-span-2 text-gray-600 text-sm flex items-center">
                  <span className="sm:hidden font-semibold mr-2"></span>
                </div>
                <div className="col-span-1 sm:col-span-2 text-gray-600 text-sm flex items-center">
                  <span className="sm:hidden font-semibold mr-2"></span>
                </div>
                <div className="col-span-1 sm:col-span-2 text-gray-600 text-sm flex items-center">
                  <span className="sm:hidden font-semibold mr-2"></span>
                  {event.eventStatus}
                </div>
                <div className="col-span-1 sm:col-span-1 relative flex justify-end">
                  <FaEllipsisV
                    className="text-gray-600 cursor-pointer text-lg hover:text-teal-600 transition-colors duration-300"
                    onClick={() => togglePopup(event.eventId)}
                  />
                  {popupVisible === event.eventId && (
                    <div
                      ref={popupRef}
                      className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-10 transform transition-all duration-200"
                    >
                      {["Xem chi tiết sự kiện", "Xóa sự kiện"].map((action) => (
                        <div
                          key={action}
                          className="px-4 py-2 text-gray-700 hover:bg-teal-100 hover:text-teal-600 cursor-pointer text-sm transition-colors duration-200"
                          onClick={() => handleActionClick(action, event.eventId)}
                        >
                          {action}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          {filteredEvents.length > 0 && (
            <div className="flex justify-between items-center p-6 bg-gray-50 border-t border-gray-200">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg text-sm transition-colors duration-300 ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-teal-500 text-white hover:bg-teal-600"
                }`}
              >
                Previous
              </button>
              <div className="flex space-x-2">
                {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors duration-300 ${
                        currentPage === page
                          ? "bg-teal-500 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-teal-100"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg text-sm transition-colors duration-300 ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-teal-500 text-white hover:bg-teal-600"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
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