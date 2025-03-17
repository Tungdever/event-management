import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddTicket = () => {
  const [ticketType, setTicketType] = useState("Paid");
  const [showForm, setShowForm] = useState(false);
  const [showOverview, setShowOverView] = useState(false);
  const navigate = useNavigate();
  const handleTicketClick = (type) => {
    setTicketType(type);
    setShowForm(true);
  };
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const TicketPopup = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="absolute top-12 right-0 bg-white shadow-lg rounded-lg p-4 w-64">
        <button
          onClick={onClose}
          className="absolute text-gray-500 text-sm mb-2 right-2"
        >
          X
        </button>
        <div className="space-y-4">
          {[
            { icon: "ticket-alt", color: "blue", label: "Paid" },
            { icon: "scissors", color: "purple", label: "Free" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center space-x-2"
              onClick={() => setShowForm(true)}
            >
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
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 250);
  }, []);

  const [tickets, setTickets] = useState([]); // Lưu danh sách ticket
  const [ticketData, setTicketData] = useState({
    name: "",
    quantity: 0,
    price: 0,
    type: "Paid",
    salesStart: "",
    startTime: "",
    salesEnd: "",
    endTime: "",
  });

  const handleSaveTicket = () => {
    setTickets([...tickets, ticketData]);
    setShowForm(false);
    setShowOverView(true);
  };

  return loading ? (
    <h1></h1>
  ) : (
    <div className="flex flex-col lg:flex-row bg-gray-50  relative">
      {/* Sidebar */}
      <aside className="bg-white w-full lg:w-1/4 p-4 shadow-sm min-h-screen">
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <h2 className="text-lg font-semibold">
            Mental Health First Aid (MHFA) Training (CPD Accredited)
          </h2>
          <div className="flex items-center text-gray-500 mt-2">
            <i className="far fa-calendar-alt mr-2"></i>
            <span>Wed, Apr 16, 2025, 10:00 AM</span>
          </div>
          <div className="flex items-center mt-4">
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2">
              Draft <i className="fas fa-caret-down ml-1"></i>
            </button>
            <a href="#" className="text-blue-600">
              Preview <i className="fas fa-external-link-alt"></i>
            </a>
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2">Steps</h3>
        <ul>
          <li className="flex items-center mb-2">
            <i className="fas fa-check-circle text-blue-600 mr-2"></i>Build
            event page
          </li>
          <li className="flex items-center mb-2">
            <i className="far fa-circle text-gray-400 mr-2"></i>Online event
            page
          </li>
          <li className="flex items-center mb-2">
            <i className="far fa-dot-circle text-blue-600 mr-2"></i>Add tickets
          </li>
          <li className="flex items-center">
            <i className="far fa-circle text-gray-400 mr-2"></i>Publish
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="relative flex-1 p-6 min-h-screen">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Create tickets
        </h1>
        <p className="text-gray-600 mb-6">
          Choose a ticket type or build a section with multiple ticket types.
        </p>
        {!showOverview ? (
          <div className="space-y-4">
            {["Paid", "Free"].map((type, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm cursor-pointer w-2/4"
                onClick={() => handleTicketClick(type)}
              >
                <div className="flex items-center">
                  <div
                    className={`p-3 rounded-full ${
                      type === "Paid"
                        ? "bg-blue-100 text-blue-600"
                        : type === "Free"
                        ? "bg-purple-100 text-purple-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    <i
                      className={`fas ${
                        type === "Donation" ? "fa-heart" : "fa-ticket-alt"
                      }`}
                    ></i>
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold">{type}</h2>
                    <p className="text-gray-600">
                      {type === "Donation"
                        ? "Let people pay any amount."
                        : `Create a ${type.toLowerCase()} ticket.`}
                    </p>
                  </div>
                </div>
                <i className="fas fa-chevron-right text-gray-400"></i>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-7xl mx-auto p-4 flex">
            <div className="w-2/3 pr-4">
              <h1 className="text-3xl font-bold text-gray-900">Tickets</h1>
              <div className="mt-6 bg-white shadow rounded-lg p-4">
                {tickets.map((ticket, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b pb-4 mb-4"
                  >
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {ticket.name}
                      </h2>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="text-green-500 mr-2">•</span>
                        <span>On Sale</span>
                        <span className="mx-2">•</span>
                        <span>
                          Ends {ticket.salesEnd} at {ticket.endTime}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-500">
                        Sold: 0/{ticket.quantity}
                      </span>
                      <span className="text-gray-500">${ticket.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
          </div>
        )}

        <div className="flex items-center justify-end p-4 rounded-lg cursor-pointer w-2/4 absolute bottom-20 right-4">
          <button
            className="bg-orange-600 text-white px-6 py-2 rounded-lg"
            onClick={() => navigate("/publicEvent")}
          >
            Save and continue
          </button>
        </div>
      </main>

      {/* Add Tickets Form */}
      <div
        className={`fixed top-0 right-0 h-full w-full lg:w-1/3 max-h-[700px] mt-[55px] border border-t-2 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          showForm ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Let's create tickets
          </h2>

          <div className="flex space-x-4 mb-4">
            {["Paid", "Free"].map((type) => (
              <button
                key={type}
                className={`px-4 py-2 rounded-md ${
                  ticketData.type === type
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setTicketData({ ...ticketData, type })}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <label className="block text-gray-700">
              Name *
              <input
                type="text"
                className="w-full border rounded-md p-2"
                value={ticketData.name}
                onChange={(e) =>
                  setTicketData({ ...ticketData, name: e.target.value })
                }
              />
            </label>
            <label className="block text-gray-700">
              Available quantity *
              <input
                type="number"
                className="w-full border rounded-md p-2"
                value={ticketData.quantity}
                onChange={(e) =>
                  setTicketData({ ...ticketData, quantity: e.target.value })
                }
              />
            </label>
            <label className="block text-gray-700">
              Price *
              <div className="flex items-center">
                <span className="bg-gray-200 px-4 py-2 rounded-l-md border border-r-0 border-gray-300">
                  $
                </span>
                <input
                  type="number"
                  className="w-full border rounded-r-md p-2"
                  value={ticketData.price}
                  onChange={(e) =>
                    setTicketData({ ...ticketData, price: e.target.value })
                  }
                />
              </div>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="block text-gray-700">
                Sales start *
                <input
                  type="date"
                  className="w-full border rounded-md p-2"
                  value={ticketData.salesStart}
                  onChange={(e) =>
                    setTicketData({ ...ticketData, salesStart: e.target.value })
                  }
                />
              </label>
              <label className="block text-gray-700">
                Start time
                <input
                  type="time"
                  className="w-full border rounded-md p-2"
                  value={ticketData.startTime}
                  onChange={(e) =>
                    setTicketData({ ...ticketData, startTime: e.target.value })
                  }
                />
              </label>
              <label className="block text-gray-700">
                Sales end *
                <input
                  type="date"
                  className="w-full border rounded-md p-2"
                  value={ticketData.salesEnd}
                  onChange={(e) =>
                    setTicketData({ ...ticketData, salesEnd: e.target.value })
                  }
                />
              </label>
              <label className="block text-gray-700">
                End time
                <input
                  type="time"
                  className="w-full border rounded-md p-2"
                  value={ticketData.endTime}
                  onChange={(e) =>
                    setTicketData({ ...ticketData, endTime: e.target.value })
                  }
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
            <button
              className="bg-orange-600 text-white px-4 py-2 rounded-md"
              
              onClick={handleSaveTicket}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTicket;
