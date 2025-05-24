import { useState, useEffect } from "react";
import Loader from "../../components/Loading";
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Checkout = ({ onClose, selectedTickets, eventData }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState(null);
  const totalPrice = selectedTickets.reduce(
    (sum, ticket) => sum + ticket.price * ticket.quantity,
    0
  );

  useEffect(() => {
    if (toastMessage && toastType) {
      if (toastType === "info") {
        toast.info(toastMessage);
      } else if (toastType === "success") {
        toast.success(toastMessage);
      } else if (toastType === "error") {
        toast.error(toastMessage);
      } else if (toastType === "warn") {
        toast.warn(toastMessage);
      }
      setToastType(null);
      setToastMessage(null);
    }
  }, [toastMessage]);

  const buyFreeTicket = async (checkoutData) => {
    setIsLoading(true); // Start loading
    const token = localStorage.getItem('token');
    let userId;

    if (!token) {
      setToastMessage("Token does not exist.");
      setToastType("error");
      setIsLoading(false); // Stop loading
      return;
    }

    try {
      // Decode JWT payload to get userId
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      userId = decodedPayload.userId;

      const tickets = checkoutData?.tickets?.reduce((acc, ticket) => {
        acc[ticket.ticketId] = ticket.quantity;
        return acc;
      }, {});

      const data = {
        orderInfo: checkoutData?.eventData.eventName,
        eventId: checkoutData?.eventData.eventId,
        amount: 0,
        userId: userId,
        tickets: tickets,
      };

      const response = await axios.post('http://localhost:8080/api/v1/payment/free-ticket', data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.statusCode === 1 || response.data.statusCode === "1") {
        // Optional: Add a slight delay to ensure spinner is visible
        setTimeout(() => {
          navigate(`/payment-result?orderCode=${response.data.data}`);
        }, 500); // 500ms delay
      } else {
        setToastMessage("Unexpected response from server.");
        setToastType("error");
      }
    } catch (error) {
      setToastMessage("Payment failed. Please try again.");
      setToastType("error");
      console.error("Error in buyFreeTicket:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const checkoutHandle = () => {
    const checkoutData = {
      amount: totalPrice,
      tickets: selectedTickets,
      eventData: eventData,
    };
    localStorage.setItem('eventCheckout', window.location.href);
    if (totalPrice > 0) {
      navigate("/checkout", { state: checkoutData });
    } else {
      buyFreeTicket(checkoutData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        {/* Show Loader as an overlay when isLoading is true */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex justify-center items-center">
            <Loader />
          </div>
        )}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Checkout</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900" disabled={isLoading}>
            ✕
          </button>
        </div>

        <div className="w-full bg-gray-100 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Order summary</h3>

          {/* Hiển thị danh sách vé đã chọn */}
          {selectedTickets.length === 0 ? (
            <p className="text-gray-700 mb-2">No tickets selected</p>
          ) : (
            selectedTickets.map((ticket) => (
              <p key={ticket.ticketId} className="text-gray-700 mb-2">
                {ticket.quantity} x {ticket.ticketName}{" "}
                <span className="float-right">
                  {(ticket.price * ticket.quantity).toLocaleString()} VND
                </span>
              </p>
            ))
          )}

          <p className="text-gray-700 mb-2">
            Delivery <span className="float-right">{selectedTickets.length} x eTicket</span>
          </p>
          <hr className="my-4" />
          <p className="text-xl font-semibold">
            Total <span className="float-right">{totalPrice.toLocaleString()} VND</span>
          </p>
        </div>

        <button
          className="bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700 mt-4 disabled:bg-blue-300"
          onClick={checkoutHandle}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Proceed to Payment'}
        </button>
      </div>
    </div>
  );
};

export default Checkout;