import { useEffect, useState } from "react";
import axios from 'axios';
import EmptyOrder from './empty-orders.jpg';
import { toast } from 'react-toastify';
import { FaTicketAlt, FaDownload, FaUndoAlt } from "react-icons/fa";

export default function MyBooking() {
  const [orders, setOrders] = useState([]);
  const [openOrders, setOpenOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const toggleOrder = (orderId) => {
    setOpenOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const convertTimestamp = (timestamp) => {
    const year = timestamp.slice(0, 4);
    const month = timestamp.slice(4, 6);
    const day = timestamp.slice(6, 8);
    const hour = timestamp.slice(8, 10);
    const minute = timestamp.slice(10, 12);
    const second = timestamp.slice(12, 14);
    const shortYear = year.slice(2);
    return `${hour}:${minute}:${second} ${day}/${month}/${shortYear}`;
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      let userId;
      if (token) {
        try {
          const payload = token.split('.')[1];
          const decodedPayload = JSON.parse(atob(payload));
          userId = decodedPayload.userId;
        } catch (e) {
          setError("Invalid token. Please log in again.");
          setLoading(false);
          return;
        }
      } else {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/api/v1/booking/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        console.log(response.data);
        setOrders(response.data);
      } catch (err) {
        setError("Failed to fetch orders. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);



  const handleRefund = async (orderId) => {
    const confirmRefund = window.confirm("Are you sure you want to request a refund for this order?");
    if (!confirmRefund) return;

    try {
      const token = localStorage.getItem('token');
      let userId;
      if (token) {
        try {
          const payload = token.split('.')[1];
          const decodedPayload = JSON.parse(atob(payload));
          userId = decodedPayload.userId;
        } catch (e) {
          toast.error("Token is invalid. Please login again.");
          return;
        }
      } else {
        toast.error("No token found. Please login.");
        return;
      }

      const response = await axios.get(`http://localhost:8080/api/v1/refund/valid/${orderId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data === true || response.data === "true") {
        const refundResponse = await axios.post(`http://localhost:8080/api/v1/refund/${orderId}`, null, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        toast.success("Refund successfully!");
        window.location.reload();
      } else {
        toast.warn("Can't refund for this invoice!");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Refund fail!';
      toast.error(errorMessage);
    }
  };

  const downloadInvoice = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:8080/api/v1/invoice/${orderId}`, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error("Download failed.");
      console.error(err);
    }
  };

  const viewTicket = (orderId) => {
    window.location.href = `/view-tickets/${orderId}`;
  }

  const statusColors = {
    SUCCESSFULLY: "text-green-600",
    REFUNDED: "text-yellow-600",
    FAILED: "text-red-600",
  };
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-center mb-12 text-gray-900 tracking-tight">
        Booking Invoices
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 max-w-md">{error}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center">
          <img
            src={EmptyOrder}
            alt="No Orders"
            className="w-64 h-64 mb-6 object-contain"
          />
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">
            You do not have any invoices.
          </h2>
          <p className="text-gray-500 max-w-md">
            When you buy event tickets, the invoice will be displayed here. <br />
            Continue to explore and experience!
          </p>
        </div>
      ) : (
        <div className="space-y-8 max-w-4xl mx-auto">
          {orders.map((order) => {
            const isOpen = openOrders.includes(order.orderId);
            return (
              <div
                key={order.orderId}
                className="bg-white shadow-lg rounded-2xl p-6 transition-all duration-300 hover:shadow-xl"
              >
                <div
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-4 cursor-pointer"
                  onClick={() => toggleOrder(order.orderId)}
                >
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Invoice ID: #{order.orderId}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Transaction time: {convertTimestamp(order.transaction.transactionDate)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Status:{" "}
                      <span className={`font-medium ${statusColors[order.transaction.transactionStatus] || "text-gray-600"}`}>
                        {order.transaction.transactionStatus || "FAILED"}
                      </span>
                    </p>
                  </div>
                  <div className="text-right mt-4 sm:mt-0">
                    <p className="text-lg font-semibold text-blue-600">
                      Total: ${order.transaction.transactionAmount}
                    </p>
                    <p className="text-sm text-blue-500 font-medium">
                      {isOpen ? "Hide Details ▲" : "View Details ▼"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:space-x-6">
                  <div className="w-full md:w-40 mb-4 md:mb-0">
                    <img
                      className="w-full h-32 object-cover rounded-lg"
                      src={order.event.eventImages || "https://via.placeholder.com/150"}
                      alt={order.event.eventName}
                      onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">
                      Event: {order.event.eventName}
                    </h2>
                    <p className="text-sm text-gray-600 mb-1">
                      Start: {new Date(order.event.eventStart).toLocaleString("vi-VN")}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      End: {new Date(order.event.eventEnd).toLocaleString("vi-VN")}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      Host: {order.event.eventHost}
                    </p>
                    <p className="text-sm text-gray-600">
                      Location: {order.event.eventLocation
                        ? `${order.event.eventLocation.venueName}, ${order.event.eventLocation.address}, ${order.event.eventLocation.city}`
                        : "Not specified"}
                    </p>

                  </div>
                </div>

                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                  <div className="space-y-4 mt-6">
                    {order.tickets.map((ticket, index) => (
                      <div
                        key={index}
                        className="flex flex-col md:flex-row justify-between items-start border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition"
                      >
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {ticket.ticketName}
                          </h3>

                        </div>
                        <div className="text-right mt-4 md:mt-0 w-full md:w-1/3">
                          <p className="text-sm text-gray-600">
                            Price: ${ticket.price}
                          </p>
                          <p className="text-sm text-gray-600">
                            Quantity: {ticket.quantity}
                          </p>
                          <p className="text-base font-semibold text-gray-800 mt-1">
                            Subtotal: ${ticket.price * ticket.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => viewTicket(order.orderId)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                  >
                    <FaTicketAlt />
                    View Tickets
                  </button>

                  <button
                    onClick={() => downloadInvoice(order.orderId)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                  >
                    <FaDownload />
                    Download Invoice
                  </button>

                  {order.transaction.transactionStatus !== "REFUNDED" && (
                    <button
                      onClick={() => setSelectedOrderId(order.orderId)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                      <FaUndoAlt />
                      Refund
                    </button>
                  )}

                </div>

              </div>
            );
          })}
        </div>
      )}
      {selectedOrderId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Refund</h2>
            <p className="text-gray-700">Are you sure you want to refund this invoice?</p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setSelectedOrderId(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleRefund(selectedOrderId);
                  setSelectedOrderId(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}