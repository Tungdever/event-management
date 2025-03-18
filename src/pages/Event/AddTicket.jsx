import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddTicket({ setTickets, tickets }) {
  const navigate = useNavigate();
  const [ticketType, setTicketType] = useState("Paid");
  const [ticketData, setTicketData] = useState({
    name: "",
    quantity: "",
    price: "0.00",
    salesStart: "",
    startTime: "",
    salesEnd: "",
    endTime: "",
  });

  const handleChange = (e) => {
    setTicketData({ ...ticketData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const newTicket = { ...ticketData, type: ticketType };
    setTickets([...tickets, newTicket]); // Thêm ticket mới vào danh sách
    navigate("/tickets"); // Chuyển sang trang ticket
  };

  return (
    <div className="fixed top-0 right-0 h-full w-full lg:w-1/3 max-h-[700px] mt-[55px] border border-t-2 bg-white shadow-lg">
      <div className="p-6">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Let's create tickets
          </h2>
        </div>

        <div className="flex space-x-4 mb-4">
          {["Paid", "Free"].map((type) => (
            <button
              key={type}
              className={`px-4 py-2 rounded-md ${ticketType === type ? "bg-blue-100 text-blue-700" : "bg-gray-200 text-gray-700"}`}
              onClick={() => setTicketType(type)}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <label className="block text-gray-700">
            Name *
            <input type="text" name="name" className="w-full border rounded-md p-2" onChange={handleChange} />
          </label>

          <label className="block text-gray-700">
            Available quantity *
            <input type="number" name="quantity" className="w-full border rounded-md p-2" onChange={handleChange} />
          </label>

          <label className="block text-gray-700">
            Price *
            <div className="flex items-center">
              <span className="bg-gray-200 px-4 py-2 rounded-l-md border border-r-0 border-gray-300">$</span>
              <input type="text" name="price" className="w-full border rounded-r-md p-2" defaultValue="0.00" onChange={handleChange} />
            </div>
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block text-gray-700">
              Sales start *
              <input type="date" name="salesStart" className="w-full border rounded-md p-2" onChange={handleChange} />
            </label>

            <label className="block text-gray-700">
              Start time
              <input type="time" name="startTime" className="w-full border rounded-md p-2" onChange={handleChange} />
            </label>

            <label className="block text-gray-700">
              Sales end *
              <input type="date" name="salesEnd" className="w-full border rounded-md p-2" onChange={handleChange} />
            </label>

            <label className="block text-gray-700">
              End time
              <input type="time" name="endTime" className="w-full border rounded-md p-2" onChange={handleChange} />
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md">Cancel</button>
          <button className="bg-orange-600 text-white px-4 py-2 rounded-md" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddTicket;
