import React from "react";

const TicketItem = ({ ticket, event }) => {
  return (
    <div className="p-4">
            <div className="relative w-full bg-white rounded-lg shadow-lg overflow-hidden transition-shadow hover:shadow-[0px_4px_10px_rgba(255,0,0,0.5)]">
                
                {/* Ticket content */}
                <div className="p-4 flex flex-col gap-4">
                    {/* Event information */}
                    <div className="flex flex-col gap-2">
                        <h1
                            className="text-xl font-bold uppercase text-gray-800"
                            title={event?.eventName || "N/A"}
                        >
                            {event?.eventName || "N/A"}
                        </h1>
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                            <div className="text-sm text-gray-600">
                                <p className="font-semibold">
                                    {new Date(event?.eventStart).toLocaleDateString() || "N/A"}
                                </p>
                                <p>
                                    {new Date(event?.eventStart).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    }) || "N/A"}
                                </p>
                            </div>
                            <div className="text-sm text-right text-gray-600">
                                <p className="font-semibold truncate" title={event?.eventLocation?.venueName}>
                                    {event?.eventLocation?.venueName || "N/A"}
                                </p>
                                <p className="truncate" title={event?.eventLocation?.address}>
                                    {event?.eventLocation?.address || "N/A"}
                                </p>
                                <p className="truncate" title={event?.eventLocation?.city}>
                                    {event?.eventLocation?.city || "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* QR code and price */}
                    <div className="flex justify-between items-center border-t pt-4">
                        <div className="flex flex-col items-center">
                            <img
                                className="w-16 h-16 object-cover mb-2"
                                src={`data:image/png;base64,${ticket?.qrCodeBase64 || ""}`}
                                alt="QR Code"
                            />
                            <span className="text-sm font-bold text-gray-800">
                                {ticket?.ticketCode || "N/A"}
                            </span>
                        </div>
                        <span className="text-lg font-bold text-gray-800">
                            {ticket?.ticketInfo?.price ? `${ticket.ticketInfo.price} VND` : "0"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
  );
};

export default TicketItem;

