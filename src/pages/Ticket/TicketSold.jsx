import React from "react";
import imgTicket from "../../assets/NoOrder.png"

const TicketDashboard = () => {
  return (
    <div className="flex-1 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Ticket dashboard</h1>

      </div>
      
      <div className="mt-6">
        <div className="flex items-center text-gray-600 ">
          <i className="fas fa-calendar-alt mr-2 text-blue-700"></i>
          <span className="text-blue-700">Feb 25, 2025 at 10:00am</span>
        </div>
        <div className="mt-4 flex items-center space-x-4">
          <input className="flex-1 px-4 py-2 border rounded-md " type="text" value="https://www.eventbrite.com/e/event-demo-for-project-tickets-1205327" readOnly/>
          <button className="px-4 py-2 rounded-md bg-blue-200 text-blue-700">Copy link</button>
          <button className="px-4 py-2 bg-blue-200 text-blue-700 rounded-md">Share</button>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {["Net Sales", "Tickets Sold", "Page Views"].map((title, index) => (
          <div key={index} className="p-4 bg-white rounded-md shadow border border-orange-600">
            <div className="text-orange-600 p-2">{title}</div>
            <div className="text-2xl font-bold text-orange-900 p-2">{title === "Tickets Sold" ? "0/100" : "$0.00"}</div>
          </div>
        ))}
      </div>
      
      <div className="mt-6">
        <h2 className="text-xl font-bold text-gray-900">Quick actions</h2>
        <div className="mt-4 flex space-x-4">
          {[
            { icon: "fas fa-users", text: "Attendees report" },
            { icon: "fas fa-lock", text: "Order form responses" },
            { icon: "fas fa-chart-line", text: "Sales report" }
          ].map((action, index) => (
            <button key={index} className="px-4 py-2 bg-green-200 text-green-700 rounded-md flex items-center space-x-2">
              <i className={`${action.icon} text-blue-600`}></i>
              <span>{action.text}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-6">
        <h2 className="text-xl font-bold text-gray-900">Sales by ticket type</h2>
        <table className="mt-4 w-full bg-white rounded-md  border border-gray-200">
          <thead>
            <tr className="text-left bg-gray-200 text-orange-500">
              <th className="px-4 py-2">Ticket type</th>
              <th className="px-4 py-2">Sold</th>
              <th className="px-4 py-2">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="px-4 py-2">VIP</td>
              <td className="px-4 py-2">0/100</td>
              <td className="px-4 py-2">10.0 VND</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-2">COMMON</td>
              <td className="px-4 py-2">0/100</td>
              <td className="px-4 py-2">5.00 VND</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="mt-6">
        <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
        <table className="mt-4 w-full bg-white rounded-[20px]   border border-gray-200" >
          <thead>
            <tr className="text-left bg-gray-200 text-orange-500">
              <th className="px-4 py-2">Order #</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Ticket type</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td colSpan="6" className="px-4 py-8 text-center text-gray-600">
                <img
                  alt="No orders icon"
                  className="mx-auto mb-4"
                  src={imgTicket}
                  width="150"
                  height="150"
                />
                No orders for this event yet
              </td>
            </tr>
          </tbody>
        </table>
        
      </div>
    </div>
  );
};

export default TicketDashboard;
