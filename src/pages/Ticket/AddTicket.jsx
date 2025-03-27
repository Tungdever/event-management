import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loading";
import TicketTypeSelector from "./TicketTypeSelector";
import TicketForm from "./TicketForm";
import TicketOverview from "./TicketOverview";
import TicketPopup from "./TicketPopup";

const AddTicket = ({ eventId, onNext }) => {
  const [tickets, setTickets] = useState([]);
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

  // Lưu ticket vào state
  const handleSaveTicket = () => {
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

  // Lưu tickets vào database
  const saveTicketsToDatabase = async () => {
    if (!eventId) {
      alert("Event ID is required to save tickets.");
      return;
    }
    if (tickets.length === 0) {
      alert("No tickets to save.");
      return;
    }

    try {
      const ticketPromises = tickets.map((ticket) => {
        const ticketData = {
          ticketName: ticket.ticketName,
          ticketType: ticket.ticketType,
          price: parseFloat(ticket.price) || 0,
          quantity: parseInt(ticket.quantity, 10),
          startTime: ticket.startTime.replace("T", " ").substring(0, 10),
          endTime: ticket.endTime.replace("T", " ").substring(0, 10),
        };

        return fetch(`http://localhost:8080/api/ticket/${eventId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ticketData),
        }).then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to save ticket: ${ticket.ticketName}`);
          }
          return response.json();
        });
      });

      const savedTickets = await Promise.all(ticketPromises);
      console.log("Tickets saved to database:", savedTickets);
      alert(`Successfully saved ${savedTickets.length} tickets to database!`);
      if (onNext) onNext();
    } catch (error) {
      console.error("Error saving tickets:", error);
      alert(`Failed to save tickets: ${error.message}`);
    }
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
        {!showOverview ? (
          <TicketTypeSelector onSelectType={handleTicketClick} />
        ) : (
          <TicketOverview
            tickets={tickets}
            onAddTicket={() => setPopupOpen(true)}
            onSaveAll={saveTicketsToDatabase}
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
      {showForm && (
        <TicketForm
          newTicket={newTicket}
          typeTicket={typeTicket}
          onChange={handleChange}
          onSave={handleSaveTicket}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default AddTicket;