import React, { useState, useEffect } from "react";

const TicketForm = ({ newTicket, typeTicket, onChange, onSave, onCancel }) => {
  const [errors, setErrors] = useState({
    ticketName: "",
    quantity: "",
    price: "",
    startTime: "",
    endTime: "",
  });

  // Validate ticket name (only letters, numbers, and spaces)
  const validateTicketName = (name) => {
    if (!name) return "Ticket name is required";
    const regex = /^[a-zA-Z0-9\s]+$/;
    return regex.test(name) ? "" : "Ticket name cannot contain special characters";
  };

  // Validate quantity (positive integer)
  const validateQuantity = (quantity) => {
    if (!quantity) return "Quantity is required";
    const num = parseInt(quantity, 10);
    return Number.isInteger(num) && num > 0 ? "" : "Quantity must be a positive integer";
  };

  // Validate price (positive number for Paid tickets)
  const validatePrice = (price) => {
    if (typeTicket !== "Paid") return "";
    if (!price) return "Price is required for paid tickets";
    const num = parseFloat(price);
    return num > 0 ? "" : "Price must be a positive number";
  };

  // Validate dates (startTime must be before endTime)
  const validateDates = (startTime, endTime) => {
    if (!startTime) return { startTime: "Sales start date is required" };
    if (!endTime) return { endTime: "Sales end date is required" };
    const start = new Date(startTime);
    const end = new Date(endTime);
    return start < end ? {} : { endTime: "Sales end date must be after start date" };
  };

  // Compute errors without setting state
  const computeErrors = () => {
    const nameError = validateTicketName(newTicket.ticketName);
    const quantityError = validateQuantity(newTicket.quantity);
    const priceError = validatePrice(newTicket.price);
    const dateErrors = validateDates(newTicket.startTime, newTicket.endTime);

    return {
      ticketName: nameError,
      quantity: quantityError,
      price: priceError,
      startTime: dateErrors.startTime || "",
      endTime: dateErrors.endTime || "",
    };
  };

  // Check if form is valid without setting state
  const isFormValid = () => {
    const { ticketName, quantity, price, startTime, endTime } = computeErrors();
    return !ticketName && !quantity && !price && !startTime && !endTime;
  };

  // Handle input change and update errors
  const handleChange = (e) => {
    onChange(e);
    setErrors(computeErrors());
  };

  // Handle save with validation
  const handleSave = () => {
    const newErrors = computeErrors();
    setErrors(newErrors);
    if (isFormValid()) {
      onSave();
    }
  };

  // Run initial validation without triggering re-renders
  useEffect(() => {
    setErrors(computeErrors());
  }, [newTicket, typeTicket]);

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
              onClick={() =>
                onChange({ target: { name: "ticketType", value: type } })
              }
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
              onChange={handleChange}
            />
            {errors.ticketName && (
              <p className="text-red-500 text-sm mt-1">{errors.ticketName}</p>
            )}
          </label>
          <label className="block text-gray-700">
            Available quantity *
            <input
              type="number"
              className="w-full border rounded-md p-2"
              name="quantity"
              value={newTicket.quantity}
              onChange={handleChange}
              min="1"
              step="1"
            />
            {errors.quantity && (
              <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
            )}
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
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                />
              </div>
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
              )}
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
                onChange={handleChange}
              />
              {errors.startTime && (
                <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>
              )}
            </label>
            <label className="block text-gray-700">
              Sales end *
              <input
                type="date"
                className="w-full border rounded-md p-2"
                name="endTime"
                value={newTicket.endTime}
                onChange={handleChange}
              />
              {errors.endTime && (
                <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>
              )}
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
            className={`px-4 py-2 rounded-md ${
              isFormValid()
                ? "bg-orange-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={handleSave}
            disabled={!isFormValid()}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketForm;