import React from "react";

function TicketsPage({ tickets }) {
  return (
    <div className="w-2/3 pr-4">
      <h1 className="text-3xl font-bold text-gray-900">Tickets</h1>
      <nav className="flex space-x-4 border-b mt-4">
        {["Admission", "Add-ons", "Promotions", "Holds", "Settings"].map((tab, index) => (
          <a key={index} href="#" className={`pb-2 ${index === 0 ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}>
            {tab}
          </a>
        ))}
      </nav>

      <div className="mt-6">
        {tickets.length > 0 ? (
          tickets.map((ticket, index) => (
            <div key={index} className="bg-white shadow rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <i className="fas fa-ticket-alt text-gray-400 mr-4"></i>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{ticket.name} ({ticket.type})</h2>
                    <div className="text-sm text-gray-500">
                      <span className="text-green-500 mr-2">•</span>
                      <span>On Sale</span>
                      <span className="mx-2">•</span>
                      <span>Ends {ticket.salesEnd} at {ticket.endTime}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-500">Sold: 0/{ticket.quantity}</span>
                  <span className="text-gray-500">${ticket.price}</span>
                  <i className="fas fa-ellipsis-v text-gray-500"></i>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No tickets available.</p>
        )}
      </div>
    </div>
  );
}

export default TicketsPage;
