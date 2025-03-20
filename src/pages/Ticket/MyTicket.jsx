import React from "react";
import TicketItem from "./TicketItem";
import Header from "../../components/Header";
import Feedback from "react-bootstrap/esm/Feedback";
import Footer from "../../components/Footer";

const TicketList = ({tickets}) => {
  return (
    <>
    <Header/>
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Purchased Tickets</h2>
      <div className="space-y-2">
        {tickets.map((ticket) => (
          <TicketItem key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default TicketList;
