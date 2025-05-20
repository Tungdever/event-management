import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loading";
import TicketForm from "./TicketForm";
import Swal from "sweetalert2";
import { CiTrash } from "react-icons/ci";

const TicketOverview = ({ tickets, onAddTicket, onSaveAll, onEditTicket, onDeleteTicket }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleSelectType = (type) => {
    onAddTicket(type);
    setDropdownOpen(false);
  };

  // Kiểm tra xem có vé "Free" trong danh sách tickets không
  const hasFreeTicket = tickets.some((ticket) => ticket.ticketType === "Free");

  // Lọc danh sách tùy chọn, ẩn "Free" nếu đã có vé Free
  const ticketOptions = [
    { icon: "ticket-alt", color: "blue", label: "Paid" },
    ...(hasFreeTicket ? [] : [{ icon: "scissors", color: "purple", label: "Free" }]),
  ];

  return (
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
                    {ticket.ticketType === "Paid"
                      ? `${ticket.price} VNĐ`
                      : "Free"}
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
                <div className="flex items-center space-x-3">
                  <i
                    className="fa-solid fa-pen-to-square hover:text-blue-600 cursor-pointer text-base"
                    onClick={() => onEditTicket(ticket)}
                  ></i>
                  <CiTrash
                    className="text-gray-500 hover:text-red-600 cursor-pointer text-xl"
                    onClick={() => onDeleteTicket(index, ticket)}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="w-1/3 flex flex-col items-end">
        <div className="relative top-4 right-4">
          <button
            onClick={toggleDropdown}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg w-full flex items-center justify-between"
          >
            Add Ticket <i className="fas fa-caret-down ml-2"></i>
          </button>
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-lg p-4 w-64 z-50">
              <button
                onClick={() => setDropdownOpen(false)}
                className="absolute text-gray-500 text-sm right-2 top-2"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
              <div className="space-y-4">
                {ticketOptions.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
                    onClick={() => handleSelectType(item.label)}
                  >
                    <div className={`bg-${item.color}-100 p-2 rounded-lg`}>
                      <i className={`fas fa-${item.icon} text-${item.color}-600`}></i>
                    </div>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-end p-4 rounded-lg cursor-pointer w-2/4 absolute bottom-20 right-4">
        <button
          className="bg-orange-600 text-white px-6 py-2 rounded-lg"
          onClick={onSaveAll}
        >
          Save and continue
        </button>
      </div>
    </div>
  );
};

const TicketTypeSelector = ({ onSelectType }) => {
  return (
    <div className="space-y-4">
      {["Paid", "Free"].map((type, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-4 rounded-[6px] shadow-sm cursor-pointer w-2/4 border border-gray-300"
          onClick={() => onSelectType(type)}
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
                {type === "Paid"
                  ? "Create a paid ticket."
                  : "Create a free ticket."}
              </p>
            </div>
          </div>
          <i className="fas fa-chevron-right text-gray-400"></i>
        </div>
      ))}
      <div className="flex items-center justify-end p-4 rounded-lg cursor-pointer w-2/4 absolute bottom-20 right-4">
        <button className="bg-orange-600 text-white px-6 py-2 rounded-lg">
          Save and continue
        </button>
      </div>
    </div>
  );
};

// Hàm chuyển đổi định dạng ISO sang yyyy-MM-dd
const formatDateForInput = (isoDate) => {
  if (!isoDate) return "";
  return isoDate.split("T")[0];
};

const AddTicket = ({ ticketData, onTicketsUpdate, eventId, onNext }) => {
  const [tickets, setTickets] = useState(ticketData || []);
  const [newTicket, setNewTicket] = useState({
    eventId: eventId || "",
    ticketId: "",
    ticketName: "",
    ticketType: "Paid",
    price: "",
    quantity: "",
    startTime: "",
    endTime: "",
    isLocal: true, // Mark new tickets as local
  });
  const [typeTicket, setTypeTicket] = useState("Paid");
  const [showForm, setShowForm] = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingTicket, setEditingTicket] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const formattedTickets = (ticketData || []).map((ticket) => ({
      ...ticket,
      startTime: formatDateForInput(ticket.startTime),
      endTime: formatDateForInput(ticket.endTime),
      isLocal: ticket.isLocal || false, // Ensure existing tickets have isLocal flag
    }));
    setTickets(formattedTickets);
  }, [ticketData]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editingTicket) {
      setEditingTicket((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewTicket((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleTicketClick = (type) => {
    setTypeTicket(type);
    setNewTicket((prev) => ({ ...prev, ticketType: type, isLocal: true }));
    setShowForm(true);
    setEditingTicket(null);
  };

  useEffect(() => {
    setNewTicket((prev) => ({ ...prev, ticketType: typeTicket }));
  }, [typeTicket]);

  const handleSaveTicket = () => {
    if (
      !newTicket.ticketName ||
      !newTicket.quantity ||
      !newTicket.startTime ||
      !newTicket.endTime
    ) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please fill in all required fields.",
      });
      return;
    }
    if (newTicket.ticketType === "Paid" && !newTicket.price) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter a price for paid tickets.",
      });
      return;
    }

    const updatedTickets = [...tickets, { ...newTicket, isLocal: true }];
    setTickets(updatedTickets);
    onTicketsUpdate(updatedTickets);

    setNewTicket({
      eventId: eventId || "",
      ticketId: "",
      ticketName: "",
      ticketType: "Paid",
      price: "",
      quantity: "",
      startTime: "",
      endTime: "",
      isLocal: true,
    });
    setShowForm(false);
    setShowOverview(true);
  };

  const handleEditTicket = (ticket) => {
    setEditingTicket({
      ...ticket,
      startTime: formatDateForInput(ticket.startTime),
      endTime: formatDateForInput(ticket.endTime),
    });
    setTypeTicket(ticket.ticketType);
    setShowForm(true);
  };

  const handleUpdateTicket = () => {
    if (
      !editingTicket.ticketName ||
      !editingTicket.quantity ||
      !editingTicket.startTime ||
      !editingTicket.endTime
    ) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please fill in all required fields.",
      });
      return;
    }
    if (editingTicket.ticketType === "Paid" && !editingTicket.price) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter a price for paid tickets.",
      });
      return;
    }

    const updatedTickets = tickets.map((ticket) =>
      ticket.ticketId === editingTicket.ticketId && !ticket.isLocal
        ? editingTicket
        : ticket.ticketId === editingTicket.ticketId
        ? editingTicket
        : ticket
    );
    setTickets(updatedTickets);
    onTicketsUpdate(updatedTickets);
    setEditingTicket(null);
    setShowForm(false);
  };

  const handleDeleteTicket = async (index, ticket) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Confirm Deletion",
      text: "Are you sure you want to delete this ticket?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    if (ticket.isLocal || !ticket.ticketId) {
      // Local ticket: remove from state
      const updatedTickets = tickets.filter((_, i) => i !== index);
      setTickets(updatedTickets);
      onTicketsUpdate(updatedTickets);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Ticket deleted successfully.",
      });
    } else {
      // Database ticket: call API
      try {
        const response = await fetch(
          `http://localhost:8080/api/ticket/delete/${ticket.ticketId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json()
        if (data.data === true) {
          const updatedTickets = tickets.filter((_, i) => i !== index);
          setTickets(updatedTickets);
          onTicketsUpdate(updatedTickets);
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Ticket deleted successfully.",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: data.msg,
          });
        }
      } catch (error) {
        console.error("Error deleting ticket:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while deleting the ticket.",
        });
      }
    }
  };

  const saveTicketsToDatabase = () => {
    if (tickets.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "No tickets to save.",
      });
      return;
    }
    if (onNext) onNext();
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="flex flex-col lg:flex-row bg-gray-50">
      <main className="flex-1 p-6 min-h-screen">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Create tickets
        </h1>
        <p className="text-gray-600 mb-6">
          Choose a ticket type or build a section with multiple ticket types.
        </p>
        {!showOverview && tickets.length === 0 ? (
          <TicketTypeSelector onSelectType={handleTicketClick} />
        ) : (
          <TicketOverview
            tickets={tickets}
            onAddTicket={handleTicketClick}
            onSaveAll={saveTicketsToDatabase}
            onEditTicket={handleEditTicket}
            onDeleteTicket={handleDeleteTicket}
          />
        )}
      </main>
      {showForm && (
        <TicketForm
          newTicket={
            editingTicket
              ? {
                  ...editingTicket,
                  startTime: formatDateForInput(editingTicket.startTime),
                  endTime: formatDateForInput(editingTicket.endTime),
                }
              : newTicket
          }
          typeTicket={typeTicket}
          onChange={handleChange}
          onSave={editingTicket ? handleUpdateTicket : handleSaveTicket}
          onCancel={() => {
            setShowForm(false);
            setEditingTicket(null);
          }}
        />
      )}
    </div>
  );
};

export default AddTicket;