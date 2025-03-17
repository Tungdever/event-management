import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
const Checkout = ({ onClose }) => {
  const [firstName, setFirstName] = useState("Trung");
  const [lastName, setLastName] = useState("Hồ");
  const [email, setEmail] = useState("trungho.234416@gmail.com");
  const [updates, setUpdates] = useState(true);
  const [bestEvents, setBestEvents] = useState(true);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 200); 
  }, []);
  return (
    loading ?<h1></h1> : 
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="max-w-4xl bg-white rounded-lg shadow-lg p-6 relative">
        {/* Nút đóng popup */}
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500">
          <i className="fas fa-times"></i>
        </button>
        
        {/* Nội dung form */}
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-2/3 p-6">
            <div className="flex items-center mb-4">
              <i className="fas fa-arrow-left text-xl"></i>
              <h2 className="text-xl font-semibold ml-4">Checkout</h2>
            </div>
            <p className="text-gray-500 mb-4">Time left 18:55</p>
            <h3 className="text-2xl font-bold mb-4">Contact information</h3>
            <p className="text-gray-700 mb-4">
              Logged in as <span className="font-semibold">{email}</span>.{' '}
              <a className="text-blue-500" href="#">Not you?</a>
            </p>
            <p className="text-red-500 mb-4">* Required</p>
            <form>
              <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
                <div className="w-full md:w-1/2">
                  <label className="block text-gray-700">First name *</label>
                  <input className="w-full border border-gray-300 rounded p-2" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block text-gray-700">Last name *</label>
                  <input className="w-full border border-gray-300 rounded p-2" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email address *</label>
                <div className="relative">
                  <input className="w-full border border-gray-300 rounded p-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <i className="fas fa-pencil-alt absolute right-3 top-3 text-gray-500"></i>
                </div>
              </div>
              <div className="mb-4">
                <label className="flex items-center">
                  <input className="form-checkbox text-blue-500" type="checkbox" checked={updates} onChange={() => setUpdates(!updates)} />
                  <span className="ml-2 text-gray-700">Keep me updated on more events and news from this event organizer.</span>
                </label>
              </div>
              <div className="mb-4">
                <label className="flex items-center">
                  <input className="form-checkbox text-blue-500" type="checkbox" checked={bestEvents} onChange={() => setBestEvents(!bestEvents)} />
                  <span className="ml-2 text-gray-700">Send me emails about the best events happening nearby or online.</span>
                </label>
              </div>
             
              <button className="w-full bg-orange-500 text-white py-2 rounded" onClick={() => navigate("/checkout")}>Pay now</button>
            </form>
            <p className="text-gray-500 text-center mt-4">Powered by <span className="font-semibold">Mangager Event</span></p>
          </div>
          <div className="w-full md:w-1/3 bg-gray-100 p-6">
            <div className="relative mb-4">
             
              <button className="absolute top-2 right-2 text-gray-500">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <h3 className="text-xl font-semibold mb-4">Order summary</h3>
            <p className="text-gray-700 mb-2">Wednesday, July 16 · 10am - 5pm +07</p>
            <p className="text-gray-700 mb-2">1 x General Admission <span className="float-right">0.00 VND</span></p>
            <p className="text-gray-700 mb-2">Delivery <span className="float-right">1 x eTicket</span></p>
            <hr className="my-4" />
            <p className="text-xl font-semibold">Total <span className="float-right">0.00 VND</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Checkout