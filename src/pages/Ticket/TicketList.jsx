import React from "react";
import TicketItem from "./TicketItem";

const tickets = [
    {
      id: "A1B2C3",
      eventName: "Music Festival 2025",
      eventDate: "April 20, 2025",
      eventTime: "18:00 - 23:00",
      location: "Central Park, New York",
      seat: "VIP Zone - A12",
      price: "$50.00",
      image: "https://i.pinimg.com/474x/c9/fc/5b/c9fc5b906a994962bbc5d530e1cb9ce6.jpg",
    },
    {
      id: "D4E5F6",
      eventName: "Tech Conference",
      eventDate: "May 15, 2025",
      eventTime: "09:00 - 17:00",
      location: "Silicon Valley Convention Center",
      seat: "Hall B - Row 5, Seat 23",
      price: "$120.00",
      image: "https://i.pinimg.com/474x/20/12/68/201268d8c3f9c7f98521b949b8671b92.jpg",
    },
    {
      id: "G7H8I9",
      eventName: "Art Exhibition",
      eventDate: "June 10, 2025",
      eventTime: "10:00 - 20:00",
      location: "Louvre Museum, Paris",
      seat: "General Admission",
      price: "$30.00",
      image: "https://i.pinimg.com/474x/92/18/4a/92184a471672bcd65d46557674d14206.jpg",
    },
  ];
  
const TicketList = () => {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Purchased Tickets</h2>
      <div className="space-y-2">
        {tickets.map((ticket) => (
          <TicketItem key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </div>
  );
};

export default TicketList;
