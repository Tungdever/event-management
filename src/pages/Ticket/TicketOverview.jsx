import React from "react";

const TicketOverview = ({ tickets, onAddTicket, onSaveAll, onEditTicket }) => {
  return (
    <div className="max-w-7xl mx-auto p-4 flex">
      <div className="w-2/3 pr-4">
        {tickets.map((ticket, index) => (
          <div
            key={index} // Nếu ticket có ticketId thì dùng ticket.ticketId thay index
            className="mt-2 bg-white rounded-[5px] p-4 border border-gray-400"
          >
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 pb-2">
                  {ticket.ticketName}
                </h2>
                <div className="flex items-center space-x-4 pb-2">
                  <span className="text-gray-500">Sold: 0/{ticket.quantity}</span>
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
                <i
                  className="fa-solid fa-pen-to-square hover:text-blue-600 hover:cursor-pointer"
                  onClick={() => onEditTicket(ticket)} // Gọi hàm edit khi click
                ></i>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="w-1/3 flex flex-col items-end">
        <div className="relative top-4 right-4">
          <button
            onClick={onAddTicket}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg w-full"
          >
            Add Ticket <i className="fas fa-caret-down"></i>
          </button>
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

export default TicketOverview;