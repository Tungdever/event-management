import React from "react";
import Loader from "../../components/Loading";
const TicketForm = ({ newTicket, typeTicket, onChange, onSave, onCancel }) => {
  
  return (
    <div
      className={`fixed top-0 right-0 h-full w-full lg:w-1/3 max-h-[700px] mt-[55px] border border-t-2 bg-white shadow-lg transform transition-transform duration-300 ease-in-out translate-x-0`}
    >
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Let's create tickets
        </h2>
        <div className="flex space-x-4 mb-4">
          {["Paid", "Free"].map((type) => (
            <button
              key={type}
              className={`px-4 py-2 rounded-md ${
                typeTicket === type
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => onChange({ target: { name: "ticketType", value: type } })}
            >
              {type}
            </button>
          ))}
        </div>
        <div className="space-y-4">
          <label className="block text-gray-700">
            Name *
            <input
              type="text"
              className="w-full border rounded-md p-2"
              name="ticketName"
              value={newTicket.ticketName}
              onChange={onChange}
            />
          </label>
          <label className="block text-gray-700">
            Available quantity *
            <input
              type="number"
              className="w-full border rounded-md p-2"
              name="quantity"
              value={newTicket.quantity}
              onChange={onChange}
              min="1"
            />
          </label>
          {typeTicket === "Paid" && (
            <label className="block text-gray-700">
              Price *
              <div className="flex items-center">
                <span className="bg-gray-200 px-4 py-2 rounded-l-md border border-r-0 border-gray-300">
                  $
                </span>
                <input
                  type="number"
                  className="w-full border rounded-r-md p-2"
                  name="price"
                  value={newTicket.price}
                  onChange={onChange}
                  min="0"
                />
              </div>
            </label>
          )}
          <div className="grid grid-cols-2 gap-4">
            <label className="block text-gray-700">
              Sales start *
              <input
                type="date"
                className="w-full border rounded-md p-2"
                name="startTime"
                value={newTicket.startTime}
                onChange={onChange}
              />
            </label>
            <label className="block text-gray-700">
              Sales end *
              <input
                type="date"
                className="w-full border rounded-md p-2"
                name="endTime"
                value={newTicket.endTime}
                onChange={onChange}
              />
            </label>
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <button
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="bg-orange-600 text-white px-4 py-2 rounded-md"
            onClick={onSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketForm;