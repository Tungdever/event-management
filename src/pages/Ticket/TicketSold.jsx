import { useEffect, useState } from "react";
import imgTicket from "../../assets/NoOrder.png"
import axios from "axios";
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
const TicketDashboard = () => {
  const [stats, setStats] = useState({});
  const [ticketTypes, setTicketTypes] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [eventInfo, setEventInfo] = useState({});
  const { eventId } = useParams();

  useEffect(() => {
  
    const token = localStorage.getItem("token"); 

    // Cấu hình header Authorization
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // Lấy thống kê
    axios.get(`http://localhost:8080/api/ticket/${eventId}/stats`, config).then((res) => setStats(res.data));
    // Lấy danh sách loại vé
    axios.get(`http://localhost:8080/api/ticket/${eventId}/ticket-types`, config).then((res) => setTicketTypes(res.data));
    // Lấy đơn hàng gần đây
    axios.get(`http://localhost:8080/api/ticket/${eventId}/recent-orders`, config).then((res) => setRecentOrders(res.data));
    
  }, [eventId]);
  return (
    <div className="flex-1 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Ticket dashboard</h1>
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

      <div className="mt-6">
        <h2 className="text-xl font-bold text-gray-900">Sales by ticket type</h2>
        <table className="mt-4 w-full bg-white rounded-md border border-gray-200">
          <thead>
            <tr className="text-left bg-gray-200 text-orange-500">
              <th className="px-4 py-2">Ticket type</th>
              <th className="px-4 py-2">Sold</th>
              <th className="px-4 py-2">Price</th>
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
              <th className="px-4 py-2">Order #</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Ticket type</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.length === 0 ? (
              <tr className="border-t">
                <td colSpan="6" className="px-4 py-8 text-center text-gray-600">
                  <img alt="No orders icon" className="mx-auto mb-4" src={imgTicket} width="150" height="150" />
                  No orders for this event yet
                </td>
              </tr>
            ) : (
              recentOrders.map((order, index) => (
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
    </div>
  );
};

export default TicketDashboard;
