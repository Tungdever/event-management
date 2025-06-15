import React, { useState, useEffect, useRef } from "react";
import { Rnd } from "react-rnd";
import { PiArmchairLight } from "react-icons/pi";
import Swal from "sweetalert2";
import * as htmlToImage from "html-to-image";

const SeatingLayoutEditor = ({
  isOpen,
  onClose,
  venueType,
  onSave,
  availableTickets = [],
}) => {
  const [layout, setLayout] = useState([
    {
      id: "stage",
      type: "stage",
      x: 50,
      y: 20,
      width: 300,
      height: 100,
      color: "#f87171", // Default color for stage (red-400)
    },
  ]);
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const containerRef = useRef(null);
  const hasValidSeating = areas.some((area) => area.type === "seating" && area.ticketId);

  useEffect(() => {
    if (!areas.some((area) => area.type === "seating")) {
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
        color: "#3b82f6", // Default color for seating area (blue-500)
      };
      setLayout([...layout, defaultArea]);
      setAreas([
        {
          id: defaultArea.id,
          name: defaultArea.name,
          capacity: defaultArea.capacity,
          price: defaultArea.price,
          type: defaultArea.type,
          ticketId: null,
          areaId: defaultArea.id,
          color: defaultArea.color,
        },
      ]);
    }
  }, []);

  const addSeatingArea = () => {
    try {
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
        color: "#3b82f6", // Default blue-500
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
          color: newArea.color,
        },
      ]);
    } catch (error) {
      console.error("Error adding seating area:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Cannot add seating area. Please try again.",
      });
    }
  };

  const updateAreaDetails = (id, updates) => {
    try {
      const ticket = updates.ticketId
        ? availableTickets.find((t) => t.ticketId === updates.ticketId)
        : null;
      const updatedDetails = ticket
        ? {
            ticketId: updates.ticketId,
            name: ticket.ticketName,
            capacity: parseInt(ticket.quantity) || 0,
            price: ticket.ticketType === "Paid" ? parseFloat(ticket.price) || 0 : 0,
            color: updates.color || areas.find((a) => a.id === id)?.color || "#3b82f6",
          }
        : {
            ticketId: null,
            name: "",
            capacity: 0,
            price: 0,
            color: updates.color || areas.find((a) => a.id === id)?.color || "#3b82f6",
          };

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
    } catch (error) {
      console.error("Error updating area details:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Cannot update area details. Please try again.",
      });
    }
  };

  const deleteArea = (id) => {
    try {
      if (id === "stage") {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Cannot delete stage.",
        });
        return;
      }
      setLayout(layout.filter((item) => item.id !== id));
      setAreas(areas.filter((area) => area.id !== id));
    } catch (error) {
      console.error("Error deleting area:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Cannot delete area. Please try again.",
      });
    }
  };

  const generateSeatingMapImage = async () => {
    if (containerRef.current) {
      try {
        // Temporarily hide edit and delete icons
        const icons = containerRef.current.querySelectorAll(".area-icon");
        icons.forEach((icon) => (icon.style.display = "none"));

        const dataUrl = await htmlToImage.toPng(containerRef.current, {
          quality: 0.8,
          pixelRatio: 1,
          backgroundColor: "#f9fafb",
          cacheBust: true,
        });

        // Restore icons
        icons.forEach((icon) => (icon.style.display = "block"));

        return dataUrl;
      } catch (error) {
        console.error("Error generating seating map image:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Cannot generate seating map image. Please try again.",
        });
        return null;
      }
    }
    return null;
  };

  const handleSave = async () => {
    try {
      if (!hasValidSeating) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Please assign at least one ticket to a seating area.",
        });
        return;
      }
      const image = await generateSeatingMapImage();
      if (image) {
        onSave(image); // Only save image, as per AddTicket.jsx
        onClose();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Cannot generate seating map image. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error saving seating layout:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Cannot save seating layout. Please try again.",
      });
    }
  };

  const renderChairs = (area) => {
    if (area.type !== "seating") return null;
    const areaDetails = areas.find((a) => a.id === area.id) || { capacity: 0 };
    const capacity = areaDetails.capacity;
    const iconSize = 24;
    const padding = 4;
    const maxIcons = 10;
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 bg-black bg-opacity-50"
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="mb-4 text-2xl font-bold">Create seating layout</h2>
        {!hasValidSeating && (
          <p className="mb-4 text-red-500">
            Please assign at least one ticket to a seating area
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
                  ? "border-red-500"
                  : "border-blue-500"
              } rounded-lg flex items-center justify-center`}
              style={{ backgroundColor: item.color || (item.type === "stage" ? "#f87171" : "#3b82f6") }}
            >
              <div className="relative flex flex-col items-center justify-center w-full h-full p-2">
                <span className="text-sm font-semibold text-white">
                  {item.type === "stage" ? "Stage" : item.name || "Unassigned"}
                </span>
                {item.type === "seating" && renderChairs(item)}
                {item.type === "seating" && (
                  <button
                    className="absolute text-red-500 area-icon top-1 right-1 hover:text-red-700"
                    onClick={() => deleteArea(item.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                )}
                {item.type === "seating" && (
                  <button
                    className="absolute text-blue-500 area-icon top-1 left-1 hover:text-blue-700"
                    onClick={() => setSelectedArea(item.id)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                )}
              </div>
            </Rnd>
          ))}
        </div>

        {selectedArea && (
          <div className="p-4 mt-4 border rounded-lg bg-gray-50">
            <h3 className="mb-2 text-lg font-semibold">Assign ticket to area</h3>
            {areas
              .filter((area) => area.id === selectedArea)
              .map((area) => (
                <div key={area.id} className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium">Select ticket</label>
                    <select
                      value={area.ticketId || ""}
                      onChange={(e) => updateAreaDetails(area.id, { ticketId: e.target.value })}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Choose a ticket</option>
                      {availableTickets.map((ticket) => (
                        <option key={ticket.ticketId} value={ticket.ticketId}>
                          {ticket.ticketName} (
                          {ticket.ticketType === "Paid"
                            ? `${ticket.price} VND`
                            : "Free"}
                          )
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Select color</label>
                    <input
                      type="color"
                      value={area.color || "#3b82f6"}
                      onChange={(e) => updateAreaDetails(area.id, { color: e.target.value })}
                      className="w-full h-10 border rounded-md cursor-pointer"
                    />
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
            Add seating area
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