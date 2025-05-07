import React from "react";

const TicketItem = ({ ticket, event }) => {
  return (
    <div className="p-2">
      <div
        className="relative w-full h-48 bg-cover bg-center rounded-lg hover:shadow-[0px_4px_10px_rgba(255,0,0,0.5)] overflow-hidden"
        style={{ backgroundImage: `url(${event.eventImages[0]})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-start p-4 text-white">
          {/* Phần thông tin vé */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold uppercase">{ticket.ticketInfo.ticketName}</h1>
              <p className="font-semibold">{new Date(event.eventStart).toLocaleDateString()}</p>
            </div>
            <div className="text-sm text-right">
              <p>
                <span className="font-semibold">Location:</span>{" "}
                {`${event.eventLocation.venueName}, ${event.eventLocation.address}, ${event.eventLocation.city}`}
              </p>
              <p>
                <span className="font-semibold">Time:</span>{" "}
                {new Date(event.eventStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          {/* Phần mã QR và giá */}
          <div className="flex justify-between items-center">
            <div className="w-16 h-16">
              <img
                className="w-full h-full object-cover"
                src={`data:image/png;base64,${ticket.qrCodeBase64}`}
                alt="QR Code"
              />
            </div>
            <span className="text-lg font-bold">{ticket.ticketInfo.price}Đ</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketItem;

