import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loading";

const AddTicket = () => {
  // tickets là mảng để lưu danh sách các ticket
  const [tickets, setTickets] = useState([]);
  
  // newTicket để lưu dữ liệu của ticket đang được thêm
  const [newTicket, setNewTicket] = useState({
    eventId: "",
    ticketId: "",
    ticketName: "",
    ticketType: "Paid",
    price: "",
    quantity: "",
    startTime: "",
    endTime: "",
  });

  const [typeTicket, setTypeTicket] = useState("Paid");
  const [showForm, setShowForm] = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const navigate = useNavigate();

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTicket((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Xử lý khi chọn loại ticket
  const handleTicketClick = (type) => {
    setTypeTicket(type);
    setNewTicket((prev) => ({ ...prev, ticketType: type }));
    setShowForm(true);
  };

  // Đồng bộ typeTicket với newTicket.ticketType
  useEffect(() => {
    setNewTicket((prev) => ({ ...prev, ticketType: typeTicket }));
  }, [typeTicket]);

  // Giả lập loading
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  // Lưu ticket
  const handleSaveTicket = () => {
    // Validate dữ liệu cơ bản
    if (!newTicket.ticketName || !newTicket.quantity || !newTicket.startTime || !newTicket.endTime) {
      alert("Please fill in all required fields.");
      return;
    }
    if (newTicket.ticketType === "Paid" && !newTicket.price) {
      alert("Please enter a price for a paid ticket.");
      return;
    }

    setTickets((prev) => [...prev, { ...newTicket }]);
    setNewTicket({
      eventId: "",
      ticketId: "",
      ticketName: "",
      ticketType: "Paid",
      price: "",
      quantity: "",
      startTime: "",
      endTime: "",
    });
    setShowForm(false);
    setShowOverview(true);
  };

  // Component popup
  const TicketPopup = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="absolute top-12 right-0 bg-white shadow-lg rounded-lg p-4 w-64">
        <button
          onClick={onClose}
          className="absolute text-gray-500 text-sm mb-2 right-2"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
        <div className="space-y-4">
          {[
            { icon: "ticket-alt", color: "blue", label: "Paid" },
            { icon: "scissors", color: "purple", label: "Free" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => handleTicketClick(item.label)}
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

  return loading ? (
    <Loader />
  ) : (
    <div className="flex flex-col lg:flex-row bg-gray-50 relative">
      {/* Main Content */}
      <main className="relative flex-1 p-6 min-h-screen">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Create tickets</h1>
        <p className="text-gray-600 mb-6">
          Choose a ticket type or build a section with multiple ticket types.
        </p>
        {!showOverview ? (
          <div className="space-y-4">
            {["Paid", "Free"].map((type, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-[6px] shadow-sm cursor-pointer w-2/4 border border-gray-300"
                onClick={() => handleTicketClick(type)}
              >
                <div className="flex items-center">
                  {type === "Paid" ? (
                    <svg
                      width="63"
                      height="63"
                      viewBox="0 0 63 63"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        width="63"
                        height="63"
                        rx="8"
                        fill="#3659E3"
                        fillOpacity="0.08"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M34.65 14.175C34.65 14.175 34.65 19.6875 29.925 19.6875C25.2 19.6875 25.2 14.175 25.2 14.175H17.325V45.675H25.2C25.1747 44.4468 25.6384 43.259 26.4891 42.3728C27.3399 41.4866 28.5078 40.9748 29.736 40.95H29.925C31.1532 40.9247 32.341 41.3884 33.2272 42.2391C34.1134 43.0899 34.6252 44.2578 34.65 45.486V45.675H42.525V14.175H34.65ZM44.1 17.325V47.25H37.8V48.825H45.675V17.325H44.1ZM26.9325 47.2503C27.4409 45.3611 28.7707 43.8 30.555 42.9978C31.1169 43.233 31.6062 43.6135 31.9725 44.1003C29.8673 44.7219 28.4037 46.6309 28.35 48.8253H20.475V47.2503H26.9325ZM25.2 30.7125V29.1375H22.05V30.7125H25.2ZM28.35 30.7125V29.1375H31.5V30.7125H28.35ZM37.8 29.1375H34.65V30.7125H37.8V29.1375ZM36.225 44.1H40.95V15.75H36.225C35.595 18.4275 33.8625 21.2625 29.925 21.2625C25.9875 21.2625 24.255 18.4275 23.625 15.75H18.9V44.1H23.625C24.1956 41.1381 26.9218 39.0935 29.925 39.375C32.9282 39.0935 35.6543 41.1381 36.225 44.1Z"
                        fill="#6898F7"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="63"
                      height="63"
                      viewBox="0 0 63 63"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        width="63"
                        height="63"
                        rx="6.38"
                        fill="#F2E7FE"
                        fillOpacity="0.8"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M36.0746 26.775H39.5489C39.4388 24.066 36.3104 21.5775 33.0248 20.7743V17.325H29.8807V20.727C29.0476 20.916 28.1672 21.1995 27.4598 21.5775L29.7707 23.8928C30.4152 23.625 31.2013 23.4675 32.1445 23.4675C34.9428 23.4675 35.9803 24.8063 36.0746 26.775ZM18.8764 20.9947L24.2842 26.4127C24.2842 29.6887 26.7366 31.4685 30.4309 32.571L35.9488 38.0992C35.4143 38.8552 34.2982 39.5325 32.1445 39.5325C28.906 39.5325 27.6327 38.0835 27.4598 36.225H24.0012C24.1899 39.6742 26.8624 41.6115 29.8807 42.2572V45.675H33.0248V42.2887C34.534 42.0052 37.3637 41.4225 38.3541 40.5247L41.844 44.0212L44.0763 41.7847L21.1087 18.7582L18.8764 20.9947Z"
                        fill="#9374E7"
                      />
                    </svg>
                  )}
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold">{type}</h2>
                    <p className="text-gray-600">
                      {type === "Paid" ? "Create a paid ticket." : "Create a free ticket."}
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
              {tickets.map((ticket, index) => (
                <div
                  key={index}
                  className="mt-2 bg-white rounded-[5px] p-4 border border-gray-400"
                >
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-900 pb-2">
                        {ticket.ticketName}
                      </h2>
                      <div className="flex items-center space-x-4 pb-2">
                        <span className="text-gray-500">
                          Sold: 0/{ticket.quantity}
                        </span>
                        <span className="text-gray-500">
                          {ticket.ticketType === "Paid" ? `${ticket.price} VNĐ` : "Free"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 border-t border-t-gray-500 pt-4 justify-between">
                      <div className="flex items-center">
                        <span className="text-green-500 mr-2">•</span>
                        <span>On Sale</span>
                        <span className="mx-2">•</span>
                        <span>Ends at {ticket.endTime}</span>
                      </div>
                      <i className="fa-solid fa-pen-to-square hover:text-blue-600 hover:cursor-pointer"></i>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="w-1/3 flex flex-col items-end">
              <div className="relative top-4 right-4">
                <button
                  onClick={() => setPopupOpen(!isPopupOpen)}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg w-full"
                >
                  Add Ticket <i className="fas fa-caret-down"></i>
                </button>
                <TicketPopup
                  isOpen={isPopupOpen}
                  onClose={() => setPopupOpen(false)}
                />
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
                  typeTicket === type
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setTypeTicket(type)}
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
                name="ticketName"
                value={newTicket.ticketName}
                onChange={handleChange}
              />
            </label>
            <label className="block text-gray-700">
              Available quantity *
              <input
                type="number"
                className="w-full border rounded-md p-2"
                name="quantity"
                value={newTicket.quantity}
                onChange={handleChange}
                min="1"
              />
            </label>
            {typeTicket === "Paid" && (
              <label className="block text-gray-700">
                Price *
                <div className="flex items-center">
                  <span className="bg-gray-200 px-4 py-2 rounded-l-md border border-r-0 border-gray-300">
                    $
                  </span>
                  <input
                    type="number"
                    className="w-full border rounded-r-md p-2"
                    name="price"
                    value={newTicket.price}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
              </label>
            )}
            <div className="grid grid-cols-2 gap-4">
              <label className="block text-gray-700">
                Sales start *
                <input
                  type="date"
                  className="w-full border rounded-md p-2"
                  name="startTime"
                  value={newTicket.startTime}
                  onChange={handleChange}
                />
              </label>
              <label className="block text-gray-700">
                Sales end *
                <input
                  type="date"
                  className="w-full border rounded-md p-2"
                  name="endTime"
                  value={newTicket.endTime}
                  onChange={handleChange}
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