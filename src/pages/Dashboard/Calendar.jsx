import { useState, useEffect } from "react";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [notes, setNotes] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    generateCalendar();
  }, [currentMonth]);

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

  return (
    <div className="w-full mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-4">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 bg-gray-100 rounded-t-lg">
        <button onClick={() => changeMonth(-1)} className="text-lg font-bold">
          &#9665;
        </button>
        <span className="text-lg font-semibold">
          {currentMonth.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </span>
        <button onClick={() => changeMonth(1)} className="text-lg font-bold">
          &#9655;
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
            onClick={() => openNotePopup(day)}
            className={`w-[180px] h-[120px] flex flex-col items-center justify-center text-center p-2 border-r border-b cursor-pointer
            ${day.isCurrentMonth ? "text-black" : "text-gray-400"}
            ${isToday(day) ? "text-blue-600 font-bold" : ""}`}
          >
            <span>{day.day}</span>
            {notes[day.day] && (
              <span className="text-xs px-2 py-1 mt-1 bg-orange-500 text-white rounded">
                {notes[day.day]}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-2">
              Ghi chú cho ngày {selectedDay}
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
                Hủy
              </button>
              <button
                onClick={saveNote}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
