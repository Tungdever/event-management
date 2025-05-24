import { useEffect, useState } from "react";
import imgTicket from "../../assets/NoOrder.png";
import axios from "axios";
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const TicketDashboard = () => {
  const [stats, setStats] = useState({});
  const [ticketTypes, setTicketTypes] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [checkInTickets, setCheckInTickets] = useState([]);
  const [eventInfo, setEventInfo] = useState({});
  const { eventId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    const token = localStorage.getItem("token"); 
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // Fetch stats
    axios.get(`http://localhost:8080/api/ticket/${eventId}/stats`, config)
      .then((res) => setStats(res.data))
      .catch((err) => toast.error("Failed to fetch stats"));
    
    // Fetch ticket types
    axios.get(`http://localhost:8080/api/ticket/${eventId}/ticket-types`, config)
      .then((res) => setTicketTypes(res.data))
      .catch((err) => toast.error("Failed to fetch ticket types"));
    
    // Fetch recent orders
    axios.get(`http://localhost:8080/api/ticket/${eventId}/recent-orders`, config)
      .then((res) => setRecentOrders(res.data))
      .catch((err) => toast.error("Failed to fetch recent orders"));
    
    // Fetch check-in tickets
    axios.get(`http://localhost:8080/api/ticket/${eventId}/check-in-tickets`, config)
      .then((res) => setCheckInTickets(res.data))
      .catch((err) => toast.error("Failed to fetch check-in tickets"));
  }, [eventId]);

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key && prevConfig.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      return { key, direction: 'asc' };
    });
  };

  // Sort data based on sortConfig
  const sortData = (data, key, direction) => {
    return [...data].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  // Filter and sort recent orders
  const filteredRecentOrders = recentOrders
    .filter(order => 
      order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.ticketType?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const sortedRecentOrders = sortConfig.key 
    ? sortData(filteredRecentOrders, sortConfig.key, sortConfig.direction)
    : filteredRecentOrders;

  // Filter and sort check-in tickets
  const filteredCheckInTickets = checkInTickets
    .filter(ticket => 
      ticket.ticketCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.ticketType?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const sortedCheckInTickets = sortConfig.key 
    ? sortData(filteredCheckInTickets, sortConfig.key, sortConfig.direction)
    : filteredCheckInTickets;

  // Pie chart data for ticket type distribution
  const ticketTypeChartData = {
    labels: ticketTypes.map(t => t.ticketType),
    datasets: [{
      data: ticketTypes.map(t => parseInt(t.sold.split('/')[0])),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
    }],
  };

  // Pie chart data for ticket status
  const ticketStatusChartData = {
    labels: ['Sold', 'Checked', 'Canceled'],
    datasets: [{
      data: [
        parseInt(stats.ticketsSold?.split('/')[0]) || 0,
        parseInt(stats.ticketsChecked) || 0,
        parseInt(stats.ticketsCanceled) || 0,
      ],
      backgroundColor: ['#36A2EB', '#4BC0C0', '#FF6384'],
      hoverBackgroundColor: ['#36A2EB', '#4BC0C0', '#FF6384'],
    }],
  };

  const chartOptions = {
    plugins: {
      legend: { position: 'bottom' },
      tooltip: { enabled: true },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="flex-1 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Ticket Dashboard</h1>
        <input
          type="text"
          placeholder="Search tickets..."
          className="p-2 border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-md shadow border border-orange-600">
          <div className="text-orange-600 p-2">Tickets Sold</div>
          <div className="text-2xl font-bold text-orange-900 p-2">{stats.ticketsSold || "0/0"}</div>
        </div>
        <div className="p-4 bg-white rounded-md shadow border border-orange-600">
          <div className="text-orange-600 p-2">Tickets Checked</div>
          <div className="text-2xl font-bold text-orange-900 p-2">{stats.ticketsChecked || "0"}</div>
        </div>
        <div className="p-4 bg-white rounded-md shadow border border-orange-600">
          <div className="text-orange-600 p-2">Tickets Canceled</div>
          <div className="text-2xl font-bold text-orange-900 p-2">{stats.ticketsCanceled || "0"}</div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-md shadow border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Ticket Type Distribution</h2>
          <div style={{ height: '300px' }}>
            <Pie data={ticketTypeChartData} options={chartOptions} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-md shadow border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Ticket Status</h2>
          <div style={{ height: '300px' }}>
            <Pie data={ticketStatusChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-bold text-gray-900">Sales by Ticket Type</h2>
        <table className="mt-4 w-full bg-white rounded-md border border-gray-200">
          <thead>
            <tr className="text-left bg-gray-200 text-orange-500">
              <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('ticketType')}>
                Ticket Type {sortConfig.key === 'ticketType' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('sold')}>
                Sold {sortConfig.key === 'sold' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('price')}>
                Price {sortConfig.key === 'price' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {ticketTypes.map((ticket, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">{ticket.ticketType}</td>
                <td className="px-4 py-2">{ticket.sold}</td>
                <td className="px-4 py-2">{ticket.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
        <table className="mt-4 w-full bg-white rounded-[20px] border border-gray-200">
          <thead>
            <tr className="text-left bg-gray-200 text-orange-500">
              <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('orderId')}>
                Order # {sortConfig.key === 'orderId' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('name')}>
                Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('quantity')}>
                Quantity {sortConfig.key === 'quantity' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('ticketType')}>
                Ticket Type {sortConfig.key === 'ticketType' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('price')}>
                Price {sortConfig.key === 'price' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('date')}>
                Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedRecentOrders.length === 0 ? (
              <tr className="border-t">
                <td colSpan="6" className="px-4 py-8 text-center text-gray-600">
                  <img alt="No orders icon" className="mx-auto mb-4" src={imgTicket} width="150" height="150" />
                  No orders for this event yet
                </td>
              </tr>
            ) : (
              sortedRecentOrders.map((order, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{order.orderId}</td>
                  <td className="px-4 py-2">{order.name}</td>
                  <td className="px-4 py-2">{order.quantity}</td>
                  <td className="px-4 py-2">{order.ticketType}</td>
                  <td className="px-4 py-2">{order.price}</td>
                  <td className="px-4 py-2">{order.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-bold text-gray-900">Check-in Tickets</h2>
        <table className="mt-4 w-full bg-white rounded-[20px] border border-gray-200">
          <thead>
            <tr className="text-left bg-gray-200 text-orange-500">
              <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('ticketCode')}>
                Ticket Code {sortConfig.key === 'ticketCode' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('status')}>
                Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('checkDate')}>
                Check-in Date {sortConfig.key === 'checkDate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('ticketType')}>
                Ticket Type {sortConfig.key === 'ticketType' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedCheckInTickets.length === 0 ? (
              <tr className="border-t">
                <td colSpan="4" className="px-4 py-8 text-center text-gray-600">
                  <img alt="No check-in tickets icon" className="mx-auto mb-4" src={imgTicket} width="150" height="150" />
                  No check-in tickets for this event yet
                </td>
              </tr>
            ) : (
              sortedCheckInTickets.map((ticket, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{ticket.ticketCode}</td>
                  <td className="px-4 py-2">{ticket.status}</td>
                  <td className="px-4 py-2">{ticket.checkDate}</td>
                  <td className="px-4 py-2">{ticket.ticketType}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketDashboard;