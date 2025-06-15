import React, { useState, useEffect, useRef } from "react";
import { Rnd } from "react-rnd";
import { PiArmchairLight } from "react-icons/pi";
import Swal from "sweetalert2";

const SeatingLayoutEditor = ({
  isOpen,
  onClose,
  venueType,
  onSave,
  existingLayout = [],
  existingAreas = [],
  availableTickets = [],
}) => {
  const [layout, setLayout] = useState(existingLayout);
  const [areas, setAreas] = useState(existingAreas);
  const [selectedArea, setSelectedArea] = useState(null);
  const containerRef = useRef(null);

  const hasValidSeating = areas.some((area) => area.type === "seating" && area.ticketId);

  useEffect(() => {
    let defaultLayout = [...existingLayout];
    let defaultAreas = [...existingAreas];

    if (!defaultLayout.length) {
      defaultLayout = [
        {
          id: "stage",
          type: "stage",
          x: 50,
          y: 20,
          width: 300,
          height: 100,
        },
      ];
    }

    if (!defaultAreas.some((area) => area.type === "seating")) {
      const defaultArea = {
        id: `area-${Date.now()}`,
        type: "seating",
        x: 50,
        y: 150,
        width: 200,
        height: 200,
        name: "",
        capacity: 0,
        price: 0,
        ticketId: null,
      };
      defaultLayout.push(defaultArea);
      defaultAreas.push({
        id: defaultArea.id,
        name: defaultArea.name,
        capacity: defaultArea.capacity,
        price: defaultArea.price,
        type: defaultArea.type,
        ticketId: null,
        areaId: defaultArea.id,
      });
    }

    setLayout(defaultLayout);
    setAreas(defaultAreas);
  }, [existingLayout, existingAreas]);

  const addSeatingArea = () => {
    const newAreaId = `area-${Date.now()}`;
    const newArea = {
      id: newAreaId,
      type: "seating",
      x: 50,
      y: 150,
      width: 200,
      height: 200,
      name: "",
      capacity: 0,
      price: 0,
      ticketId: null,
    };
    setLayout([...layout, newArea]);
    setAreas([
      ...areas,
      {
        id: newAreaId,
        name: newArea.name,
        capacity: newArea.capacity,
        price: newArea.price,
        type: newArea.type,
        ticketId: null,
        areaId: newAreaId,
      },
    ]);
  };

  const updateAreaDetails = (id, ticketId) => {
    const ticket = availableTickets.find((t) => t.ticketId === ticketId);
    const updatedDetails = ticket
      ? {
          ticketId,
          name: ticket.ticketName,
          capacity: parseInt(ticket.quantity) || 0,
          price: ticket.ticketType === "Paid" ? parseFloat(ticket.price) || 0 : 0,
        }
      : { ticketId: null, name: "", capacity: 0, price: 0 };

    setAreas(
      areas.map((area) =>
        area.id === id ? { ...area, ...updatedDetails, areaId: area.areaId || id } : area
      )
    );
    setLayout(
      layout.map((item) =>
        item.id === id ? { ...item, ...updatedDetails } : item
      )
    );
  };

  const deleteArea = (id) => {
    if (id === "stage") {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Cannot delete the stage.",
      });
      return;
    }
    setLayout(layout.filter((item) => item.id !== id));
    setAreas(areas.filter((area) => area.id !== id));
  };

  const handleSave = () => {
    if (!hasValidSeating) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "At least one seating area with a selected ticket is required.",
      });
      return;
    }
    onSave(layout, areas);
    onClose();
  };

  const renderChairs = (area) => {
    if (area.type !== "seating") return null;
    const areaDetails = areas.find((a) => a.id === area.id) || { capacity: 0 };
    const capacity = areaDetails.capacity;
    const iconSize = 24;
    const padding = 4;
    const maxIcons = 10; // Giới hạn tối đa 10 icon
    const displayCount = Math.min(capacity, maxIcons);

    const icons = [];
    for (let i = 0; i < displayCount; i++) {
      icons.push(
        <PiArmchairLight
          key={i}
          className="text-gray-600"
          style={{ width: iconSize, height: iconSize, margin: padding / 2 }}
        />
      );
    }

    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: padding,
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        {icons}
        {capacity > maxIcons && (
          <span className="text-sm font-semibold text-gray-800">
            +{capacity - maxIcons}
          </span>
        )}
      </div>
    );
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="mb-4 text-2xl font-bold">Create Seating Layout</h2>
        {!hasValidSeating && (
          <p className="mb-4 text-red-500">
            Please assign a ticket to at least one seating area.
          </p>
        )}
        <div
          ref={containerRef}
          className="relative w-full h-[500px] border border-gray-300 rounded-lg bg-gray-50 overflow-hidden"
        >
          {layout.map((item) => (
            <Rnd
              key={item.id}
              size={{ width: item.width, height: item.height }}
              position={{ x: item.x, y: item.y }}
              onDragStop={(e, d) => {
                setLayout(
                  layout.map((l) =>
                    l.id === item.id ? { ...l, x: d.x, y: d.y } : l
                  )
                );
              }}
              onResizeStop={(e, direction, ref, delta, position) => {
                setLayout(
                  layout.map((l) =>
                    l.id === item.id
                      ? {
                          ...l,
                          width: ref.offsetWidth,
                          height: ref.offsetHeight,
                          x: position.x,
                          y: position.y,
                        }
                      : l
                  )
                );
              }}
              bounds="parent"
              minWidth={50}
              minHeight={50}
              className={`border ${
                item.type === "stage"
                  ? "border-red-500 bg-red-100"
                  : "border-blue-500 bg-blue-100"
              } rounded-lg flex items-center justify-center`}
            >
              <div className="relative flex flex-col items-center justify-center w-full h-full p-2">
                <span className="text-sm font-semibold">
                  {item.type === "stage" ? "Stage" : item.name || "Unassigned"}
                </span>
                {item.type === "seating" && renderChairs(item)}
                {item.type === "seating" && (
                  <button
                    className="absolute text-red-500 top-1 right-1 hover:text-red-700"
                    onClick={() => deleteArea(item.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                )}
                {item.type === "seating" && (
                  <button
                    className="absolute text-blue-500 top-1 left-1 hover:text-blue-700"
                    onClick={() => setSelectedArea(item.id)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                )}
              </div>
            </Rnd
            >
          ))}
        </div>

        {selectedArea && (
          <div className="p-4 mt-4 border rounded-lg bg-gray-50">
            <h3 className="mb-2 text-lg font-semibold">Assign Ticket to Area</h3>
            {areas
              .filter((area) => area.id === selectedArea)
              .map((area) => (
                <div key={area.id} className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium">Select Ticket</label>
                    <select
                      value={area.ticketId || ""}
                      onChange={(e) => updateAreaDetails(area.id, e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Select a ticket</option>
                      {availableTickets.map((ticket) => (
                        <option key={ticket.ticketId} value={ticket.ticketId}>
                          {ticket.ticketName} ({ticket.ticketType === "Paid" ? `${ticket.price} VND` : "Free"})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            <button
              className="px-4 py-2 mt-2 text-white bg-blue-500 rounded-lg"
              onClick={() => setSelectedArea(null)}
            >
              Close
            </button>
          </div>
        )}

        <div className="flex justify-between mt-4">
          <button
            className="px-4 py-2 text-white bg-blue-500 rounded-lg"
            onClick={addSeatingArea}
          >
            Add Seating Area
          </button>
          <div>
            <button
              className="px-4 py-2 mr-2 text-gray-700 bg-gray-300 rounded-lg"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                hasValidSeating
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-gray-700 cursor-not-allowed"
              }`}
              onClick={handleSave}
              disabled={!hasValidSeating}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatingLayoutEditor;