import React from "react";

const TicketItem = ({ ticket }) => {
  return (
    <div className="p-2">
      <div
        className="relative w-full h-48 bg-cover bg-center rounded-lg  hover:shadow-[0px_4px_10px_rgba(255,0,0,0.5)] overflow-hidden "
        style={{ backgroundImage: `url(${ticket.image})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-start p-4 space-y-12 text-white">
          <div className="flex justify-between items-center mt-4">
            <div>
              <h1 className="text-2xl font-bold uppercase">
                {ticket.ticketName}
              </h1>
              <p className="text-semibold">{ticket.eventDate}</p>
            </div>
            <div className="text-sm">
              <p>
                <span className="font-semibold">Location:</span>{" "}
                {ticket.location}
              </p>
              <p>
                <span className="font-semibold">Time:</span> {ticket.eventTime}
              </p>
              <p>
                <span className="font-semibold">Seat:</span> {ticket.seat}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="bg-white text-black px-3 py-1 rounded-md text-xs font-medium">
              {ticket.id}
            </span>
            <span className="text-lg font-bold">{ticket.price}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketItem;
