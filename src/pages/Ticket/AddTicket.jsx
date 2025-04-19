import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loading";
import TicketTypeSelector from "./TicketTypeSelector";
import TicketForm from "./TicketForm";
import TicketOverview from "./TicketOverview";
import TicketPopup from "./TicketPopup";

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
  });
  const [typeTicket, setTypeTicket] = useState("Paid");
  const [showForm, setShowForm] = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Chuyển đổi định dạng ngày khi ticketData thay đổi
    const formattedTickets = (ticketData || []).map((ticket) => ({
      ...ticket,
      startTime: formatDateForInput(ticket.startTime),
      endTime: formatDateForInput(ticket.endTime),
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
    setNewTicket((prev) => ({ ...prev, ticketType: type }));
    setShowForm(true);
    setEditingTicket(null);
  };

  useEffect(() => {
    setNewTicket((prev) => ({ ...prev, ticketType: typeTicket }));
  }, [typeTicket]);

  const handleSaveTicket = () => {
    if (!newTicket.ticketName || !newTicket.quantity || !newTicket.startTime || !newTicket.endTime) {
      alert("Please fill in all required fields.");
      return;
    }
    if (newTicket.ticketType === "Paid" && !newTicket.price) {
      alert("Please enter a price for a paid ticket.");
      return;
    }

    const updatedTickets = [...tickets, { ...newTicket }];
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
    if (!editingTicket.ticketName || !editingTicket.quantity || !editingTicket.startTime || !editingTicket.endTime) {
      alert("Please fill in all required fields.");
      return;
    }
    if (editingTicket.ticketType === "Paid" && !editingTicket.price) {
      alert("Please enter a price for a paid ticket.");
      return;
    }

    const updatedTickets = tickets.map((ticket) =>
      ticket.ticketId === editingTicket.ticketId ? editingTicket : ticket
    );
    setTickets(updatedTickets);
    onTicketsUpdate(updatedTickets);
    setEditingTicket(null);
    setShowForm(false);
  };

  const saveTicketsToDatabase = () => {
    if (tickets.length === 0) {
      alert("No tickets to save.");
      return;
    }
    if (onNext) onNext();
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="flex flex-col lg:flex-row bg-gray-50 relative">
      <main className="relative flex-1 p-6 min-h-screen">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Create tickets</h1>
        <p className="text-gray-600 mb-6">
          Choose a ticket type or build a section with multiple ticket types.
        </p>
        {!showOverview && tickets.length === 0 ? (
          <TicketTypeSelector onSelectType={handleTicketClick} />
        ) : (
          <TicketOverview
            tickets={tickets}
            onAddTicket={() => setPopupOpen(true)}
            onSaveAll={saveTicketsToDatabase}
            onEditTicket={handleEditTicket}
          />
        )}
        <TicketPopup
          isOpen={isPopupOpen}
          onClose={() => setPopupOpen(false)}
          onSelectType={(type) => {
            handleTicketClick(type);
            setPopupOpen(false);
          }}
        />
      </main>
      {showForm && 
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
 
      }
    </div>
  );
};

export default AddTicket;