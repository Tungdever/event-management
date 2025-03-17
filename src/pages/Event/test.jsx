import { useState } from "react";

const TicketPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-12 right-0 bg-white shadow-lg rounded-lg p-4 w-64">
      <button onClick={onClose} className="absolute text-gray-500 text-sm mb-2 right-2">X</button>
      <div className="space-y-4">
        {[
          { icon: "ticket-alt", color: "blue", label: "Paid" },
          { icon: "scissors", color: "purple", label: "Free" },
         
        ].map((item) => (
          <div key={item.label} className="flex items-center space-x-2">
            <div className={`bg-${item.color}-100 p-2 rounded-lg`}>
              <i className={`fas fa-${item.icon} text-${item.color}-600`}></i>
            </div>
            <span>{item.label}</span>
          </div>
        ))}

      </div>
    </div>
  );
};

const TicketsPage = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto p-4 flex">
      {/* Left Side - Ticket List */}
      <div className="w-2/3 pr-4">
        <h1 className="text-3xl font-bold text-gray-900">Tickets</h1>
        <nav className="flex space-x-4 border-b mt-4">
          {["Admission", "Add-ons", "Promotions", "Holds", "Settings"].map((tab, index) => (
            <a
              key={index}
              href="#"
              className={`pb-2 ${index === 0 ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
            >
              {tab}
            </a>
          ))}
        </nav>
        <div className="mt-6 bg-white shadow rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <i className="fas fa-bars text-gray-400 mr-4"></i>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Test Ticket Paid</h2>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="text-green-500 mr-2">•</span>
                  <span>On Sale</span>
                  <span className="mx-2">•</span>
                  <span>Ends Apr 16, 2025 at 10:00 AM</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-500">Sold: 0/30</span>
              <span className="text-gray-500">$2.00</span>
              <i className="fas fa-ellipsis-v text-gray-500"></i>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center text-gray-500">
            <span>Event capacity</span>
            <i className="fas fa-info-circle ml-2"></i>
          </div>
          <div className="text-blue-600">
            <span>0 / 300</span>
            <a href="#" className="ml-2">Edit capacity</a>
          </div>
        </div>
      </div>
      
      {/* Right Side - Add Ticket Button & Popup */}
      <div className="w-1/3 flex flex-col items-end">
        <div className="relative top-4 right-4">
          <button
            onClick={() => setPopupOpen(!isPopupOpen)}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg w-full"
          >
            Add Ticket <i className="fas fa-caret-down"></i>
          </button>
          <TicketPopup isOpen={isPopupOpen} onClose={() => setPopupOpen(false)} />
        </div>
      </div>

      {/* Fixed Next Button */}
      <div className="fixed bottom-4 right-4">
        <button className="bg-orange-600 text-white px-6 py-3 rounded-lg">Next</button>
      </div>
    </div>
  );
};

export default TicketsPage;
