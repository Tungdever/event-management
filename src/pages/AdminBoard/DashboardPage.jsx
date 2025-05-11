import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
const DashboardPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const eventsPerPage = 4; // Số sự kiện mỗi trang
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const fetchAllEvent = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/admin/dashboard", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data.data);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { title: 'Total Events', value: data.totalEvents, icon: 'fas fa-calendar-alt', color: '#a5d8ff', change: '' },
    { title: 'Total Organizer', value: data.totalOrganizers, icon: 'fas fa-users', color: '#a7f3d0', change: '' },
    { title: 'Total Tickets', value: data.totalTicketsSold, icon: 'fas fa-shopping-cart', color: '#d8b4fe', change: '' },
    { title: 'Total Sales', value: data.totalRevenue, icon: 'fas fa-dollar-sign', color: '#fed7aa', change: '' },
    { title: 'Total Orders', value: data.totalBookings, icon: 'fas fa-shopping-cart', color: '#d8b4fe', change: '' },

    { title: 'Total events this month', value: data.totalEventsThisMonth, icon: 'fas fa-calendar-alt', color: '#a5d8ff', change: data?.totalEventsChange || "" },
    { title: 'Organizer upgrade this month', value: data.totalOrganizersThisMonth, icon: 'fas fa-users', color: '#a7f3d0', change: data?.totalOrganizersChange || "" },
    { title: 'Total tickets this month', value: data.totalTicketsSoldThisMonth, icon: 'fas fa-shopping-cart', color: '#d8b4fe', change: data?.totalTicketsSoldChange || "" },
    { title: 'Total sales this month', value: data.totalRevenueThisMonth, icon: 'fas fa-dollar-sign', color: '#fed7aa', change: data?.totalRevenueChange || "" },
    { title: 'Total orders this month', value: data.totalBookingsThisMonth, icon: 'fas fa-shopping-cart', color: '#d8b4fe', change: data?.totalBookingsChange || "" },

  ];

  useEffect(() => {
    fetchAllEvent();
  }, []);

  // Tính toán các sự kiện hiển thị trên trang hiện tại
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = data.events?.slice(indexOfFirstEvent, indexOfLastEvent);

  // Tính tổng số trang
  const totalPages = Math.ceil(data.events?.length / eventsPerPage);

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
          {/* <button
            aria-label="Select monthly"
            className="text-xs bg-gray-200 text-gray-700 rounded-full px-3 py-1 flex items-center gap-1 hover:bg-gray-300"
          >
            Monthly
            <i className="fas fa-chevron-down text-[10px]"></i>
          </button> */}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 max-w-[1440px]">


          {stats.map((stat) => (
            <div
              key={stat.title}
              className="bg-[#f9fafb] rounded-xl p-4 w-28 min-w-[200px] flex flex-col items-center text-center"
            >
              <div className={`rounded-full p-2 mb-2`} style={{ backgroundColor: stat.color }}>
                <i className={`${stat.icon} text-[#1e293b]`}></i>
              </div>
              <p className="text-[10px] text-gray-600 mb-1 select-none">{stat.title}</p>
              <p className="font-bold text-sm text-[#1e1e2d] mb-1">{stat.value}</p>
              <p
                className={`text-xs font-semibold select-none ${stat.change.startsWith('+') ? 'text-[#22c55e]' : 'text-[#f87171]'
                  }`}
              >

                {stat.change && (
                  <p className={`text-xs font-semibold select-none flex items-center gap-1 ${stat.change.startsWith('+') ? 'text-[#22c55e]' : 'text-[#f87171]'
                    }`}>
                    <i className={`fas ${stat.change.startsWith('+') ? 'fa-arrow-up' : 'fa-arrow-down'}`}></i>
                    {stat.change}
                    <span className="font-normal text-gray-500"> from last month</span>
                  </p>
                )}

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
              className={`px-3 py-1 rounded-md text-sm ${currentPage === 1
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
                className={`px-3 py-1 rounded-md text-sm ${currentPage === page
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
              className={`px-3 py-1 rounded-md text-sm ${currentPage === totalPages
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