import { useState, useEffect } from "react";
import Loader from "../../components/Loading";
import {
  
  useNavigate
} from 'react-router-dom';

const Checkout = ({ onClose, selectedTickets, eventData }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const totalPrice = selectedTickets.reduce(
    (sum, ticket) => sum + ticket.price * ticket.quantity,
    0
  );
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 200); 
  }, []);
  const checkoutHandle = () => {
    const checkoutData = {
      amount: totalPrice,
      tickets: selectedTickets,
      eventName: eventData.eventName,
    };
    navigate("/checkout", {state: checkoutData});
  }
  return (
    loading ?<Loader/> : 
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Checkout</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
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
                  {(ticket.price * ticket.quantity).toFixed(2)} USD
                </span>
              </p>
            ))
          )}

          <p className="text-gray-700 mb-2">
            Delivery <span className="float-right">{selectedTickets.length} x eTicket</span>
          </p>
          <hr className="my-4" />
          <p className="text-xl font-semibold">
            Total <span className="float-right">{totalPrice.toFixed(2)} USD</span>
          </p>
        </div>

        <button
          className="bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700 mt-4"
          onClick={checkoutHandle}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}
export default Checkout