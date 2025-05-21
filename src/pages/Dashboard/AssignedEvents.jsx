import { useState, useEffect, useRef } from "react";
import { Calendar, MapPin, Tag, User } from "lucide-react";
import { useAuth } from "../Auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import { FaEllipsisV } from "react-icons/fa";
import Swal from "sweetalert2";
const AssignedEvents = () => {
  const { user } = useAuth();
  const popupRef = useRef(null);
  const [events, setEvents] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [popupVisible, setPopupVisible] = useState(null);

  const togglePopup = (id) => setPopupVisible(popupVisible === id ? null : id);

  const fetchAssignedEvents = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/role-assignment/${userId}/my-assigned-events`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch assigned events");
      }
      const result = await response.json();
      setEvents(result);
    } catch (error) {
      console.error("Failed to load assigned events:", error);
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/events/${eventId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete event");
      }
      setEvents(events.filter((e) => e.event.eventId !== eventId));

      Swal.fire({
        Icon: "success",
        Title: "success",
        Text: "Event deleted successfully",
      });
    } catch (error) {
      Swal.fire({
        Icon: "error",
        Title: "error",
        Text: "Failed to delete event",
      });
    }
  };

  const handleActionClick = (action, eventId) => {
    if (action === "View detail event") {
      navigate(`/dashboard/my-team/${eventId}`, { state: { eventId } });
    } else if (action === "Delete event") {
      if (window.confirm("Are you sure you want to delete this event?")) {
        deleteEvent(eventId);
      }
    }
    setPopupVisible(null);
  };

  useEffect(() => {
    if (user?.userId) {
      fetchAssignedEvents(user.userId);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setPopupVisible(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getLocation = (location) => {
    if (location.locationType === "online") {
      return "Online";
    }
    return `${location.venueName}, ${location.address}, ${location.city}`;
  };

  // Xác định các hành động dựa trên roleName và permissions
  const getAvailableActions = (roleName, permissions) => {
    const actions = [];

    // Hành động "View detail event" luôn khả dụng
    actions.push("View detail event");

    // Hành động "Delete event" chỉ khả dụng nếu người dùng có quyền DELETE_EVENT hoặc vai trò ORGANIZER
    if (permissions.includes("DELETE_EVENT") || roleName === "ROLE_ORGANIZER") {
      actions.push("Delete event");
    }

    return actions;
  };

  return (
    <div className="mx-auto max-w-4xl min-h-screen p-6 bg-gray-50 rounded-[8px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Assigned Events 
        </h1>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {events.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No events are assigned.
          </p>
        ) : (
          events.map(({ event, roleName, permissions }, index) => (
            <div
              key={`${event.eventId}-${roleName}-${index}`}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              <div className="flex flex-col md:flex-row gap-4">
                {/* Event Image */}
                {event.eventImages?.[0] && (
                  <img
                    src={event.eventImages[0]}
                    alt={event.eventName}
                    className="w-full md:w-48 h-32 object-cover rounded-md"
                  />
                )}

                {/* Event Details */}
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-indigo-700">
                    {event.eventName}
                  </h2>
                  <p
                    className="text-sm text-gray-600 mt-2 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: event.eventDesc }}
                  ></p>

                  <div className="mt-3 space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                      <span>
                        {formatDateTime(event.eventStart)} -{" "}
                        {formatDateTime(event.eventEnd)}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-2 text-indigo-500" />
                      <span>{getLocation(event.eventLocation)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="w-4 h-4 mr-2 text-indigo-500" />
                      <span>Chủ sự kiện: {event.eventHost}</span>
                    </div>
                    {event.tags && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Tag className="w-4 h-4 mr-2 text-indigo-500" />
                        <span>{event.tags.split("|").join(", ")}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Role and Permissions */}
                <div className="md:w-48 relative">
                  <h3 className="text-sm font-semibold text-gray-700">
                    Roles: {roleName.replace("ROLE_", "")}
                  </h3>
                  <ul className="mt-2 text-sm text-gray-600">
                    {permissions.map((perm, idx) => (
                      <li key={idx} className="flex items-center">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                        {perm}
                      </li>
                    ))}
                  </ul>

                  <div className="relative flex justify-end">
                    <FaEllipsisV
                      className="text-gray-600 cursor-pointer text-lg hover:text-teal-600 transition-colors duration-300"
                      onClick={() => togglePopup(event.eventId)}
                    />
                    {popupVisible === event.eventId && (
                      <div
                        ref={popupRef}
                        className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-10 transform transition-all duration-200"
                      >
                        {getAvailableActions(roleName, permissions).map(
                          (action) => (
                            <div
                              key={action}
                              className="px-4 py-2 text-gray-700 hover:bg-teal-100 hover:text-teal-600 cursor-pointer text-sm transition-colors duration-200"
                              onClick={() =>
                                handleActionClick(action, event.eventId)
                              }
                            >
                              {action}
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AssignedEvents;
