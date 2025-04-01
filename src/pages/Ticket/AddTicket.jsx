import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loading";
import TicketTypeSelector from "./TicketTypeSelector";
import TicketForm from "./TicketForm";
import TicketOverview from "./TicketOverview";
import TicketPopup from "./TicketPopup";

const AddTicket = ({ ticketData, onTicketsUpdate, eventId, onNext }) => {
  // Đồng bộ tickets với ticketData từ parent
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
  const navigate = useNavigate();

  // Đồng bộ tickets với ticketData khi ticketData thay đổi
  useEffect(() => {
    setTickets(ticketData || []);
  }, [ticketData]);

  // Giả lập loading
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

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

    // Reset form
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
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Create tickets
        </h1>
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
