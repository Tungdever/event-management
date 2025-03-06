import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState([]);

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

  return (
    <div className="w-full mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-4">
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
      <div className="grid grid-cols-7 p-4 border-t border-l">
  {/* Hàng tiêu đề */}
  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
    <div
      key={day}
      className="w-[180px] h-[60px] flex items-center justify-center text-center font-bold text-gray-700 p-2 border-r border-b bg-gray-100"
    >
      {day}
    </div>
  ))}
  {/* Các ô ngày */} 
  {daysInMonth.map((day, index) => (
    <div
      key={index}
      className={`w-[180px] h-[120px] flex items-center justify-center text-center p-2 border-r border-b ${
        day.isCurrentMonth ? "text-black" : "text-gray-400"
      } ${isToday(day) ? "bg-blue-300" : ""}`}
    >
      {day.day}
    </div>
  ))}
</div>

    </div>
  );
};

const CalendarPage = () => {
  return (
    
     
      <Calendar />
  );
};

export default CalendarPage;
