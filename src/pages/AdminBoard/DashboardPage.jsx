import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const eventsPerPage = 4; // Số sự kiện mỗi trang
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

  const stats = [
    { title: 'Total Events', value: '150', icon: 'fas fa-calendar-alt', color: '#a5d8ff', change: '+3.4%' },
    { title: 'Active Accounts', value: '320', icon: 'fas fa-users', color: '#a7f3d0', change: '-2.8%' },
    { title: 'Total Sales', value: '$12,500', icon: 'fas fa-dollar-sign', color: '#fed7aa', change: '+4.6%' },
    { title: 'Total Orders', value: '780', icon: 'fas fa-shopping-cart', color: '#d8b4fe', change: '-1.1%' },
  ];

  useEffect(() => {
    fetchAllEvent();
  }, []);

  // Tính toán các sự kiện hiển thị trên trang hiện tại
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  // Tính tổng số trang
  const totalPages = Math.ceil(events.length / eventsPerPage);

  // Hàm chuyển trang
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <section className="space-y-6 overflow-y-auto">
      <div className="bg-white rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-bold text-sm text-[#1e1e2d] select-none">Overview</h1>
      
        </div>
        <div className="flex space-x-4 mb-6 max-w-full overflow-x-auto gap-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="bg-[#f9fafb] rounded-xl p-4 w-28 min-w-[260px] flex flex-col items-center text-center"
            >
              <div className={`rounded-full p-2 mb-2`} style={{ backgroundColor: stat.color }}>
                <i className={`${stat.icon} text-[#1e293b]`}></i>
              </div>
              <p className="text-[10px] text-gray-600 mb-1 select-none">{stat.title}</p>
              <p className="font-bold text-sm text-[#1e1e2d] mb-1">{stat.value}</p>
              <p
                className={`text-xs font-semibold select-none ${
                  stat.change.startsWith('+') ? 'text-[#22c55e]' : 'text-[#f87171]'
                }`}
              >
                {stat.change}
                <span className="font-normal text-gray-500"> from last month</span>
              </p>
            </div>
          ))}
        </div>
        <h1 className="font-bold text-sm mb-4 select-none">Event List</h1>

        <div className="mt-6 bg-white rounded-md shadow text-[14px]">
          <div className="flex items-center p-4 border-b border-gray-200">
            <div className="w-1/2 text-gray-600">Event</div>
            <div className="w-1/6 text-gray-600">Sold</div>
            <div className="w-1/6 text-gray-600">Gross</div>
            <div className="w-1/6 text-gray-600">Status</div>
          </div>
          {loading ? (
            <div className="p-4 text-center text-gray-600">Loading...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-600">{error}</div>
          ) : currentEvents.length === 0 ? (
            <div className="p-4 text-center text-gray-600">No events available</div>
          ) : (
            currentEvents.map((event) => (
              <div key={event.eventId} className="flex items-center p-4 relative hover:bg-gray-100">
                <div className="w-1/2 flex items-center space-x-4 text-[13px]">
                  {event.eventImages && event.eventImages.length > 0 ? (
                    <img
                      src={event.eventImages[0]}
                      alt={event.eventName}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-[16px] font-semibold">{event.eventName}</h3>
                    <p className="text-gray-600">{event.eventLocation.venueName}</p>
                    <p className="text-gray-600">{event.eventType}</p>
                  </div>
                </div>
                <div className="w-1/6 text-gray-600">0</div>
                <div className="w-1/6 text-gray-600">0</div>
                <div className="w-1/6 text-gray-600">{event.eventStatus}</div>
              </div>
            ))
          )}
        </div>

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="mt-4 flex justify-end items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md text-sm ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded-md text-sm ${
                  currentPage === page
                    ? 'bg-[#3b82f6] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md text-sm ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default DashboardPage;