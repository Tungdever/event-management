import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const OrganizerDashboard = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const eventsPerPage = 4;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/organizer/dashboard", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      setData({
        ...response.data,
        revenueOverTime: {
          labels: months,
          data: response.data.revenueByMonth,
        },
      });
    } catch (error) {
      setError(error.message);
      console.error("Error fetching data:", error);
      setData({
        totalEvents: 0,
        totalTicketsSold: 0,
        totalRevenue: 0,
        totalSponsors: 0,
        revenueByMonth: [],
        ticketTypeCount: {},
        events: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchDashboardData();
  }, [navigate, token]);

  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Filter events based on search term
  const filteredEvents = data.events?.filter(event =>
    event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.eventLocation.venueName.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null; // Reset to default
    }
    setSortConfig({ key, direction });
  };

  // Sort events
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (!sortConfig.key || !sortConfig.direction) return 0;

    const aValue = sortConfig.key === 'event' ? a.eventName.toLowerCase() :
                   sortConfig.key === 'location' ? a.eventLocation.venueName.toLowerCase() :
                   sortConfig.key === 'sold' ? a.sold :
                   sortConfig.key === 'gross' ? a.eventRevenue :
                   a.eventStatus.toLowerCase();
    const bValue = sortConfig.key === 'event' ? b.eventName.toLowerCase() :
                   sortConfig.key === 'location' ? b.eventLocation.venueName.toLowerCase() :
                   sortConfig.key === 'sold' ? b.sold :
                   sortConfig.key === 'gross' ? b.eventRevenue :
                   b.eventStatus.toLowerCase();

    if (sortConfig.direction === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = sortedEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(sortedEvents.length / eventsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Overview stats
  const stats = [
    { title: 'Total Events', value: data.totalEvents, icon: 'fas fa-calendar-check', color: '#a5d8ff' },
    { title: 'Tickets Sold', value: data.totalTicketsSold, icon: 'fas fa-ticket-alt', color: '#d8b4fe' },
    { title: 'Total Revenue', value: `${data.totalRevenue} Đ`, icon: 'fas fa-dollar-sign', color: '#fed7aa' },
    { title: 'Sponsors', value: data.totalSponsors, icon: 'fas fa-handshake', color: '#a7f3d0' },
  ];

  // Bar Chart: Tickets Sold vs Revenue per Event
  const ticketsVsRevenueData = {
    labels: data.events?.map(event => event.eventName),
    datasets: [
      {
        label: 'Tickets Sold',
        data: data.events?.map(event => event.sold),
        backgroundColor: '#d8b4fe',
        yAxisID: 'y1',
      },
      {
        label: 'Revenue',
        data: data.events?.map(event => event.eventRevenue),
        backgroundColor: '#fed7aa',
        yAxisID: 'y2',
      },
    ],
  };

  // Line Chart: Revenue Over Time
  const revenueOverTimeData = {
    labels: data.revenueOverTime?.labels || [],
    datasets: [
      {
        label: 'Revenue',
        data: data.revenueOverTime?.data || [],
        fill: false,
        borderColor: '#3b82f6',
        tension: 0.1,
      },
    ],
  };

  return (
    <section className="space-y-6 overflow-y-auto p-6">
      <div className="bg-white rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-bold text-lg text-[#1e1e2d] select-none">
            Organizer Dashboard - {data.organizer}
          </h1>
        </div>

        {/* Overview Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 max-w-[1440px]">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="bg-[#f9fafb] rounded-xl p-4 min-w-[200px] flex flex-col items-center text-center"
            >
              <div className={`rounded-full p-2 mb-2`} style={{ backgroundColor: stat.color }}>
                <i className={`${stat.icon} text-[#1e293d]`}></i>
              </div>
              <p className="text-sm text-gray-600 mb-1 select-none">{stat.title}</p>
              <p className="font-bold text-lg text-[#1e1e2d]">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <h1 className="font-bold text-lg mb-4 select-none">Statistics</h1>
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-6">
          {/* Line Chart: Revenue Over Time */}
          <div className="bg-[#f9fafb] rounded-xl p-4">
            <h2 className="text-sm font-semibold mb-4">Revenue Over Time</h2>
            <div className="relative" style={{ maxHeight: '300px' }}>
              <Line
                data={revenueOverTimeData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Revenue Over Time' },
                  },
                  scales: {
                    y: { beginAtZero: true },
                  },
                }}
              />
            </div>
          </div>

          {/* Bar Chart: Tickets Sold vs Revenue */}
          {/* <div className="bg-[#f9fafb] rounded-xl p-4 col-span-2">
            <h2 className="text-sm font-semibold mb-4">Tickets Sold vs Revenue per Event</h2>
            <div className="relative" style={{ maxHeight: '300px' }}>
              <Bar
                data={ticketsVsRevenueData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Tickets Sold vs Revenue' },
                  },
                  scales: {
                    y1: {
                      type: 'linear',
                      display: true,
                      position: 'left',
                      beginAtZero: true,
                      title: { display: true, text: 'Tickets Sold' },
                    },
                    y2: {
                      type: 'linear',
                      display: true,
                      position: 'right',
                      beginAtZero: true,
                      title: { display: true, text: 'Revenue ($)' },
                      grid: { drawOnChartArea: false },
                    },
                  },
                }}
              />
            </div>
          </div> */}
        </div>

        {/* Event List */}
        <h1 className="font-bold text-lg mb-4 select-none">Your Events</h1>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by event name, type, or venue..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
          />
        </div>
        <div className="mt-6 bg-white rounded-md shadow text-[14px]">
          <div className="flex items-center p-4 border-b border-gray-200">
            <div
              className="w-1/2 text-gray-600 cursor-pointer flex items-center"
              onClick={() => handleSort('event')}
            >
              Event
              {sortConfig.key === 'event' && (
                <span className="ml-2">
                  {sortConfig.direction === 'asc' ? '↑' : sortConfig.direction === 'desc' ? '↓' : ''}
                </span>
              )}
            </div>
            <div
              className="w-1/6 text-gray-600 cursor-pointer flex items-center"
              onClick={() => handleSort('location')}
            >
              Location
              {sortConfig.key === 'location' && (
                <span className="ml-2">
                  {sortConfig.direction === 'asc' ? '↑' : sortConfig.direction === 'desc' ? '↓' : ''}
                </span>
              )}
            </div>
            <div
              className="w-1/6 text-gray-600 cursor-pointer flex items-center"
              onClick={() => handleSort('sold')}
            >
              Sold
              {sortConfig.key === 'sold' && (
                <span className="ml-2">
                  {sortConfig.direction === 'asc' ? '↑' : sortConfig.direction === 'desc' ? '↓' : ''}
                </span>
              )}
            </div>
            <div
              className="w-1/6 text-gray-600 cursor-pointer flex items-center"
              onClick={() => handleSort('gross')}
            >
              Gross
              {sortConfig.key === 'gross' && (
                <span className="ml-2">
                  {sortConfig.direction === 'asc' ? '↑' : sortConfig.direction === 'desc' ? '↓' : ''}
                </span>
              )}
            </div>
            <div
              className="w-1/6 text-gray-600 cursor-pointer flex items-center"
              onClick={() => handleSort('status')}
            >
              Status
              {sortConfig.key === 'status' && (
                <span className="ml-2">
                  {sortConfig.direction === 'asc' ? '↑' : sortConfig.direction === 'desc' ? '↓' : ''}
                </span>
              )}
            </div>
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
                  {event.eventImages[0] ? (
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
                    <p className="text-gray-600">{event.eventType}</p>
                  </div>
                </div>
                <div className="w-1/6 text-gray-600">{event.eventLocation.venueName}</div>
                <div className="w-1/6 text-gray-600">{event.sold}</div>
                <div className="w-1/6 text-gray-600">{event.eventRevenue} Đ</div>
                <div className="w-1/6 text-gray-600">{event.eventStatus}</div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
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

export default OrganizerDashboard;