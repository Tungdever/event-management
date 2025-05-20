import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import SidebarAdminBoard from "./Sidebar";
// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const DashboardPage = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 4;
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
      const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];

      // 1. Tính doanh thu theo 12 tháng (dành cho biểu đồ Revenue Over Time)
      const revenueByMonth = Array(12).fill(0);
      response.data.data.transactions?.forEach(transaction => {
        const monthStr = transaction.transactionDate.substring(4, 6);
        const monthIndex = parseInt(monthStr, 10) - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
          revenueByMonth[monthIndex] += transaction.transactionAmount;
        }
      });
      const revenueOverTime = { labels: months, data: revenueByMonth };

      // 2. Tính phân bố trạng thái đặt chỗ
      const bookingStatusCount = {};
      response.data.data.events?.forEach(event => {
        event.bookings?.forEach(booking => {
          bookingStatusCount[booking.bookingStatus] = (bookingStatusCount[booking.bookingStatus] || 0) + 1;
        });
      });
      const bookingStatusData = {
        labels: Object.keys(bookingStatusCount),
        datasets: [{
          data: Object.values(bookingStatusCount),
          backgroundColor: ['#a5d8ff', '#d8b4fe', '#f87171'],
          hoverOffset: 4,
          borderWidth: 1,
          borderColor: '#ffffff',
        }],
      };

      // 3. Tính số lượng người dùng hoạt động và không hoạt động
      const userActiveCount = { active: 0, inactive: 0 };
      response.data.data.users?.forEach(user => {
        userActiveCount[user.isActive ? 'active' : 'inactive'] += 1;
      });
      const userActivityData = {
        labels: ['Active', 'Inactive'],
        datasets: [{
          data: [userActiveCount.active, userActiveCount.inactive],
          backgroundColor: ['#a7f3d0', '#fed7aa'],
        }],
      };

      // 4. Tính phân bố phương thức thanh toán
      const paymentMethodCount = {};
      response.data.data.transactions?.forEach(transaction => {
        const method = transaction.paymentMethod || 'Unknown';
        paymentMethodCount[method] = (paymentMethodCount[method] || 0) + 1;
      });
      const paymentMethodData = {
        labels: Object.keys(paymentMethodCount),
        datasets: [{
          data: Object.values(paymentMethodCount),
          backgroundColor: ['#a5d8ff', '#a7f3d0', '#d8b4fe', '#fed7aa'],
          hoverOffset: 4,
          borderWidth: 1,
          borderColor: '#ffffff',
        }],
      };

      // 5. Tính giá trị hoàn tiền theo 12 tháng
      const refundByMonth = Array(12).fill(0);
      response.data.data.transactions?.forEach(transaction => {
        transaction.refunds?.forEach(refund => {
          const monthStr = refund.refundDate?.substring(4, 6) || transaction.transactionDate.substring(4, 6);
          const monthIndex = parseInt(monthStr, 10) - 1;
          if (monthIndex >= 0 && monthIndex < 12) {
            refundByMonth[monthIndex] += refund.refundAmount || 0;
          }
        });
      });
      const refundsOverTime = { labels: months, data: refundByMonth };

      // 6. Tính phân bố trạng thái sự kiện
      const eventStatusCount = {};
      response.data.data.events?.forEach(event => {
        eventStatusCount[event.eventStatus] = (eventStatusCount[event.eventStatus] || 0) + 1;
      });
      const eventStatusData = {
        labels: Object.keys(eventStatusCount),
        datasets: [{
          data: Object.values(eventStatusCount),
          backgroundColor: ['#a5d8ff', '#d8b4fe', '#f87171', '#fed7aa'],
          hoverOffset: 4,
          borderWidth: 1,
          borderColor: '#ffffff',
        }],
      };

      // 7. Tính số lượng sự kiện theo tổ chức
      const organizerActivityCount = {};
      response.data.data.events?.forEach(event => {
        const organizerName = event.user?.name || 'Unknown'; // Giả định user là organizer
        organizerActivityCount[organizerName] = (organizerActivityCount[organizerName] || 0) + 1;
      });
      const organizerActivityData = {
        labels: Object.keys(organizerActivityCount),
        datasets: [{
          label: 'Events Organized',
          data: Object.values(organizerActivityCount),
          backgroundColor: '#3b82f6',
        }],
      };

      // 8. Tính totalQuantity và totalRevenue cho mỗi sự kiện
      const eventsWithStats = response.data.data.events?.map(event => {
        const totalQuantity = event.bookings?.reduce((sum, booking) => {
          return sum + (booking.bookingDetails?.reduce((q, detail) => q + detail.quantity, 0) || 0);
        }, 0) || 0;
        const totalRevenue = event.bookings?.reduce((sum, booking) => {
          return sum + (booking.transaction?.transactionAmount || 0);
        }, 0) || 0;
        return {
          ...event,
          totalQuantity,
          totalRevenue,
          eventImage: event.eventImages?.[0] || '', // Lấy ảnh đầu tiên nếu có
          eventLocation: event.eventLocation?.venueName || '', // Lấy venueName từ eventLocation
        };
      });

      console.log(response.data.data);
      setData({
        ...response.data.data,
        events: eventsWithStats, // Cập nhật events với totalQuantity và totalRevenue
        revenueOverTime,
        bookingStatusData,
        userActivityData,
        paymentMethodData,
        refundsOverTime,
        eventStatusData,
        organizerActivityData,
      });
    } catch (error) {
      setError(error.message);
      console.error("Error fetching data:", error);
      setData({
        totalActiveEvents: 0,
        totalRevenueYTD: 0,
        averageTicketPrice: 0,
        refundRate: 0,
        newOrganizersThisMonth: 0,
        bookingConversionRate: 0,
        topEventCategory: 'N/A',
        userEngagementScore: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { title: 'Total Active Events', value: data.totalActiveEvents ?? 0, icon: 'fas fa-calendar-check', color: '#a5d8ff', change: '' },
    { title: 'Revenue YTD (2025)', value: `$${data.totalRevenueYTD?.toLocaleString() ?? 0}`, icon: 'fas fa-dollar-sign', color: '#fed7aa', change: '' },
    { title: 'Average Ticket Price', value: `$${data.averageTicketPrice?.toFixed(2) ?? 0}`, icon: 'fas fa-ticket-alt', color: '#d8b4fe', change: '' },
    { title: 'Refund Rate', value: `${data.refundRate ?? 0}%`, icon: 'fas fa-undo', color: '#f87171', change: '' },
    { title: 'New Organizers This Month', value: data.newOrganizersThisMonth ?? 0, icon: 'fas fa-user-plus', color: '#a7f3d0', change: '' },
    { title: 'Booking Conversion Rate', value: `${data.bookingConversionRate ?? 0}%`, icon: 'fas fa-check-circle', color: '#22c55e', change: '' },
    { title: 'Top Event Category', value: data.topEventCategory ?? 'N/A', icon: 'fas fa-chart-line', color: '#3b82f6', change: '' },
    { title: 'User Engagement Score', value: data.userEngagementScore ?? 0, icon: 'fas fa-users', color: '#9ca3af', change: '' },
  ];

  useEffect(() => {
    fetchAllEvent();
  }, []);



  // Doughnut Chart: Event Type Distribution
  const eventTypeCount = data.events?.reduce((acc, event) => {
    acc[event.eventType] = (acc[event.eventType] || 0) + 1;
    return acc;
  }, {}) || {};

  const eventTypeData = {
    labels: Object.keys(eventTypeCount),
    datasets: [
      {
        data: Object.values(eventTypeCount),
        backgroundColor: [
          '#a5d8ff', // Xanh dương nhạt
          '#a7f3d0', // Xanh lá nhạt
          '#d8b4fe', // Tím nhạt
          '#fed7aa', // Cam nhạt
          '#f87171', // Đỏ nhạt
          '#6ee7b7', // Xanh ngọc
          '#f472b6', // Hồng
          '#93c5fd', // Xanh dương trung
          '#facc15', // Vàng
        ],
        hoverBackgroundColor: [
          '#87c7ff', // Xanh dương nhạt sáng hơn
          '#8eebbb', // Xanh lá nhạt sáng hơn
          '#c89eff', // Tím nhạt sáng hơn
          '#f5c08f', // Cam nhạt sáng hơn
          '#e55e5e', // Đỏ nhạt sáng hơn
          '#4ade80', // Xanh ngọc sáng hơn
          '#ec4899', // Hồng sáng hơn
          '#60a5fa', // Xanh dương trung sáng hơn
          '#eab308', // Vàng sáng hơn
        ],
        hoverOffset: 4,
        borderWidth: 1,
        borderColor: '#ffffff',
      },
    ],
  }

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


  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = data.events?.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(data.events?.length / eventsPerPage);

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 max-w-[1440px]">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="bg-[#f9fafb] rounded-xl p-4 w-28 min-w-[200px] flex flex-col items-center text-center"
            >
              <div className={`rounded-full p-2 mb-2`} style={{ backgroundColor: stat.color }}>
                <i className={`${stat.icon} text-[#1e293d]`}></i>
              </div>
              <p className="text-[10px] text-gray-600 mb-1 select-none">{stat.title}</p>
              <p className="font-bold text-sm text-[#1e1e2d] mb-1">{stat.value}</p>
              {stat.change && (
                <p className={`text-xs font-semibold select-none flex items-center gap-1 ${stat.change.startsWith('+') ? 'text-[#22c55e]' : 'text-[#f87171]'}`}>
                  <i className={`fas ${stat.change.startsWith('+') ? 'fa-arrow-up' : 'fa-arrow-down'}`}></i>
                  {stat.change}
                  <span className="font-normal text-gray-500"> from last month</span>
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <h1 className="font-bold text-sm mb-4 select-none">Statistics</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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

          {/* Doughnut Chart: Event Type Distribution */}
          <div className="bg-[#f9fafb] rounded-xl p-4">
            <h2 className="text-sm font-semibold mb-4">Event Type Distribution</h2>
            <div className="relative" style={{ maxHeight: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ width: '60%', height: '40%' }}>
                <Doughnut
                  data={eventTypeData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: { position: 'top' },
                      title: { display: true, text: 'Event Types' },
                      tooltip: { enabled: true },
                    },
                    animation: { duration: 500, easing: 'easeOutQuart' },
                    cutout: '60%',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <h1 className="font-bold text-sm mb-4 select-none">Event List</h1>
        <div className="mt-6 bg-white rounded-md shadow text-[14px]">
          <div className="flex items-center p-4 border-b border-gray-200">
            <div className="w-1/2 text-gray-600">Event</div>
            <div className="w-1/6 text-gray-600">Organizer</div>
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
                      className="w-16 h-16 sm:w-20 h-20 object-cover rounded-lg shadow-sm"
                    />
                  ) : (
                    <div className="w-16 h-16 sm:w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center shadow-sm">
                      <span className="text-gray-500 text-xs sm:text-sm">No image</span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-[16px] font-semibold">{event.eventName}</h3>
                    <p className="text-gray-600">{event.eventLocation}</p> {/* Sử dụng eventLocation đã được ánh xạ */}
                    <p className="text-gray-600">{event.eventType}</p>
                  </div>
                </div>
                <div className="w-1/6 text-gray-600">{event.eventHost}</div>
                <div className="w-1/6 text-gray-600">{event.sold}</div>
                <div className="w-1/6 text-gray-600">{event.eventRevenue}</div>
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