import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [notes, setNotes] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showCreateEventDialog, setShowCreateEventDialog] = useState(false);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Danh sách màu cố định để gán ngẫu nhiên cho sự kiện
  const colorPalette = [
    "#FF6B6B", // Đỏ
    "#4ECDC4", // Xanh ngọc
    "#45B7D1", // Xanh dương
    "#96CEB4", // Xanh lá
    "#FFEEAD", // Vàng nhạt
    "#D4A5A5", // Hồng
    "#9B59B6", // Tím
  ];

  // Hàm tạo màu ngẫu nhiên từ colorPalette
  const getRandomColor = () => {
    return colorPalette[Math.floor(Math.random() * colorPalette.length)];
  };

  // Gán màu ngẫu nhiên cho mỗi sự kiện
  const eventsWithColors = events.map((event) => ({
    ...event,
    color: getRandomColor(),
  }));

  useEffect(() => {
    fetchAllEvents();
    generateCalendar();
  }, [currentMonth]);
  const handleViewDetail = (eventId) => {
    navigate(`/event/${eventId}`);
  };
  const fetchAllEvents = async () => {
    if (!token) {
      setError("No authentication token found");
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
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();
    const nextMonthDays = 35 - (firstDay + totalDays);

    let days = [];
    for (let i = firstDay; i > 0; i--) {
      days.push({ day: prevMonthDays - i + 1, isCurrentMonth: false });
    }
    for (let i = 1; i <= totalDays; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }
    for (let i = 1; i <= nextMonthDays; i++) {
      days.push({ day: i, isCurrentMonth: false });
    }
    setDaysInMonth(days);
  };

  const changeMonth = (offset) => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1)
    );
  };

  const today = new Date();
  const isToday = (day) => {
    return (
      day.isCurrentMonth &&
      today.getDate() === day.day &&
      today.getMonth() === currentMonth.getMonth()
    );
  };

  const openNotePopup = (day) => {
    if (!day.isCurrentMonth) return;
    setSelectedDay(day.day);
    setNoteText(notes[day.day] || "");
    setShowPopup(true);
  };

  const saveNote = () => {
    setNotes({ ...notes, [selectedDay]: noteText });
    setShowPopup(false);
  };

  const openCreateEventDialog = (day) => {
    if (!day.isCurrentMonth) return;
    setSelectedDay(day.day);
    setShowCreateEventDialog(true);
  };

  const handleCreateEvent = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;
    const day = selectedDay;
    const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
    localStorage.setItem("dateBegin", formattedDate);
    setShowCreateEventDialog(false);
    navigate("/createEvent");
  };

  const closeCreateEventDialog = () => {
    setShowCreateEventDialog(false);
    setSelectedDay(null);
  };

  // Lấy danh sách sự kiện cho một ngày cụ thể
  const getEventsForDay = (day) => {
    if (!day.isCurrentMonth) return [];
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const dateStr = `${year}-${(month + 1).toString().padStart(2, "0")}-${day.day
      .toString()
      .padStart(2, "0")}`;
    return eventsWithColors.filter((event) => {
      const eventDate = new Date(event.eventStart).toISOString().split("T")[0];
      return eventDate === dateStr;
    });
  };

  return (
    <div className="w-full mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-4">
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div>Loading...</div> {/* Thay bằng Loader nếu có */}
        </div>
      )}
      {error && (
        <div className="text-center p-4 text-red-600">
          Error: {error}. Please try again later.
        </div>
      )}
      {!isLoading && !error && (
        <>
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 bg-gray-100 rounded-t-lg">
            <button onClick={() => changeMonth(-1)} className="text-lg font-bold">
              ◁
            </button>
            <span className="text-lg font-semibold">
              {currentMonth.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <button onClick={() => changeMonth(1)} className="text-lg font-bold">
              ▷
            </button>
          </div>

          {/* Calendar */}
          <div className="grid grid-cols-7 p-4 border-t border-l">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="w-[180px] h-[60px] flex items-center justify-center text-center font-bold text-gray-700 p-2 border-r border-b bg-gray-100"
              >
                {day}
              </div>
            ))}

            {daysInMonth.map((day, index) => (
              <div
                key={index}
                onClick={() => openCreateEventDialog(day)}
                className={`w-[180px] h-[120px] flex flex-col items-center justify-start text-center p-2 border-r border-b cursor-pointer
                ${day.isCurrentMonth ? "text-black" : "text-gray-400"}
                ${isToday(day) ? "text-blue-600 font-bold" : ""}`}
              >
                <span>{day.day}</span>
                {/* Hiển thị danh sách sự kiện */}
                <div className="mt-1 w-full">
                  {getEventsForDay(day).map((event) => (
                    <div
                      key={event.eventId}
                      className="text-xs px-2 py-1 mt-1 text-white rounded truncate"
                      style={{ backgroundColor: event.color }}
                      title={event.eventName}
                      onClick={()=>handleViewDetail(event.eventId)}
                    >
                      {event.eventName}
                    </div>
                  ))}
                </div>
                {notes[day.day] && (
                  <span className="text-xs px-2 py-1 mt-1 bg-orange-500 text-white rounded">
                    {notes[day.day]}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Popup for Notes */}
          {showPopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-4 rounded-lg shadow-lg w-80">
                <h3 className="text-lg font-semibold mb-2">
                  Note for day {selectedDay}
                </h3>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="w-full p-2 border rounded"
                  rows="3"
                />
                <div className="flex justify-end mt-3">
                  <button
                    onClick={() => setShowPopup(false)}
                    className="px-3 py-1 bg-gray-300 rounded mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveNote}
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Dialog for Create Event */}
          {showCreateEventDialog && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-lg font-semibold mb-4">
                  Do you want to create an event on this day?
                </h3>
                <p className="text-gray-600 mb-6">
                  Selected date: {selectedDay}/{currentMonth.getMonth() + 1}/
                  {currentMonth.getFullYear()}
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={closeCreateEventDialog}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    No
                  </button>
                  <button
                    onClick={handleCreateEvent}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Calendar;