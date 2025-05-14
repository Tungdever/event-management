// SectionEvent.jsx
import { useState, useRef } from "react";
import { FaList, FaUser } from "react-icons/fa";
import Swal from "sweetalert2";

const ImageUploader = ({ onImageUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        Swal.fire({
          icon: "warning",
          title: "Warning",
          text: "Please upload an image file.",
        });
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      setSelectedFile(imageUrl);
      onImageUpload({ file, imageUrl });
    }
  };

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-full w-[50px] h-[50px] cursor-pointer overflow-hidden hover:border-blue-500 transition-colors"
      onClick={handleIconClick}
    >
      {selectedFile ? (
        <img
          src={selectedFile}
          alt="Uploaded Preview"
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        <div>
          <i className="fa-solid fa-image text-gray-600 text-xl"></i>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
};

const SegmentFormPopup = ({
  isOpen,
  onClose,
  newSegment,
  handleChange,
  handleImageUpload,
  desc,
  setDesc,
  actor,
  setActor,
  onSave,
  isEditing,
  loading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {isEditing ? "Edit Segment" : "Add New Segment"}
        </h2>
        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2 font-medium" htmlFor="title">
              Title<span className="text-red-500">*</span>
            </label>
            <input
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              type="text"
              id="segmentTitle"
              placeholder="Enter title"
              name="segmentTitle"
              value={newSegment.segmentTitle}
              onChange={handleChange}
            />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-gray-700 mb-2 font-medium" htmlFor="start-time">
                Start Time<span className="text-red-500">*</span>
              </label>
              <input
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                type="time"
                id="start-time"
                name="startTime"
                value={newSegment.startTime}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 mb-2 font-medium" htmlFor="end-time">
                End Time<span className="text-red-500">*</span>
              </label>
              <input
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                type="time"
                id="end-time"
                name="endTime"
                value={newSegment.endTime}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            {!desc ? (
              <button
                className="flex items-center text-blue-600 hover:text-blue-800 transition"
                onClick={() => setDesc(true)}
              >
                <FaList className="mr-2" /> Add Description
              </button>
            ) : (
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <label className="block text-gray-700 mb-2 font-medium">
                    Description
                  </label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    rows="4"
                    name="segmentDesc"
                    value={newSegment.segmentDesc}
                    onChange={handleChange}
                    placeholder="Enter description..."
                  />
                  <div className="text-right text-gray-400 text-sm mt-1">
                    {newSegment.segmentDesc.length} / 1000
                  </div>
                </div>
                <i
                  className="fa-solid fa-xmark text-gray-500 hover:text-red-500 cursor-pointer mt-2"
                  onClick={() => setDesc(false)}
                ></i>
              </div>
            )}
            {!actor ? (
              <button
                className="flex items-center text-blue-600 hover:text-blue-800 transition"
                onClick={() => setActor(true)}
              >
                <FaUser className="mr-2" /> Add Speaker
              </button>
            ) : (
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <label className="block text-gray-700 mb-2 font-medium">
                    Speaker Name <span className="text-red-500">*</span>
                  </label>
                  <div className="flex space-x-4 items-center mb-4">
                    <input
                      className="w-[200px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      type="text"
                      id="speakerName"
                      placeholder="Enter speaker name"
                      name="speakerName"
                      value={newSegment.speakerName}
                      onChange={handleChange}
                    />
                    {newSegment.speakerImage ? (
                      <div className="relative">
                        <img
                          src={newSegment.speakerImage}
                          alt="Speaker"
                          className="w-[50px] h-[50px] rounded-full object-cover"
                        />
                        <button
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          onClick={() => handleImageUpload(null)}
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <ImageUploader onImageUpload={handleImageUpload} />
                    )}
                  </div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Speaker Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    rows="4"
                    name="speakerDesc"
                    value={newSegment.speakerDesc}
                    onChange={handleChange}
                    placeholder="Enter speaker description..."
                  />
                  <div className="text-right text-gray-400 text-sm mt-1">
                    {newSegment.speakerDesc.length} / 1000
                  </div>
                </div>
                <i
                  className="fa-solid fa-xmark text-gray-500 hover:text-red-500 cursor-pointer mt-2"
                  onClick={() => setActor(false)}
                ></i>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end mt-6 space-x-3">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            onClick={onSave}
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : isEditing
              ? "Save Changes"
              : "Save Segment"}
          </button>
        </div>
      </div>
    </div>
  );
};

const SectionEvent = ({ eventId, segmentData, onSegmentUpdate, eventStart, eventEnd }) => {
  const [segments, setSegments] = useState(segmentData || []);
  const [newSegment, setNewSegment] = useState({
    eventId: eventId || "",
    segmentId: "",
    segmentTitle: "",
    segmentDesc: "",
    speakerName: "",
    speakerDesc: "",
    speakerImage: "",
    speakerImageFile: null,
    startTime: "",
    endTime: "",
  });
  const [desc, setDesc] = useState(false);
  const [actor, setActor] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  // Check for time overlap and event boundaries
  const checkTimeOverlap = (newStart, newEnd, excludeIndex = null) => {
    const newStartTime = new Date(`1970-01-01T${newStart}:00`);
    const newEndTime = new Date(`1970-01-01T${newEnd}:00`);

    // Check if end time is after start time
    if (newEndTime <= newStartTime) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "End time must be before the event end time.",
      });
      return false;
    }

    // Check if segment times are within event boundaries
    if (eventStart && eventEnd) {
      const eventStartTime = new Date(`1970-01-01T${eventStart}:00`);
      const eventEndTime = new Date(`1970-01-01T${eventEnd}:00`);

      if (newStartTime < eventStartTime) {
        Swal.fire({
          icon: "warning",
          title: "Warning",
          text: "Segment start time cannot be earlier than the event start time.",
        });
        return false;
      }
      if (newEndTime > eventEndTime) {
        Swal.fire({
          icon: "warning",
          title: "Warning",
          text: "Segment end time cannot be later than the event end time.",
        });
        return false;
      }
    }

    // Check for overlap with other segments
    for (let i = 0; i < segments.length; i++) {
      if (excludeIndex !== null && i === excludeIndex) continue;

      const segment = segments[i];
      const start = new Date(`1970-01-01T${segment.startTime}:00`);
      const end = new Date(`1970-01-01T${segment.endTime}:00`);

      if (
        (newStartTime >= start && newStartTime < end) ||
        (newEndTime > start && newEndTime <= end) ||
        (newStartTime <= start && newEndTime >= end)
      ) {
        Swal.fire({
          icon: "warning",
          title: "Warning",
          text: "This time range overlaps with another segment.",
        });
        return false;
      }
    }
    return true;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSegment((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageUpload = (data) => {
    setNewSegment((prevData) => ({
      ...prevData,
      speakerImage: data ? data.imageUrl : "",
      speakerImageFile: data ? data.file : null,
    }));
  };

  // Handle adding a new segment
  const handleAddSlot = () => {
    if (
      !newSegment.segmentTitle ||
      !newSegment.startTime ||
      !newSegment.endTime
    ) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please fill in all required fields (Title, Start Time, End Time).",
      });
      return;
    }
    if (actor && (!newSegment.speakerName || !newSegment.speakerDesc)) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please fill in Speaker Name and Speaker Description.",
      });
      return;
    }

    // Check for time overlap and event boundaries
    if (!checkTimeOverlap(newSegment.startTime, newSegment.endTime)) {
      return;
    }

    const segmentToAdd = {
      segmentTitle: newSegment.segmentTitle,
      speaker: actor
        ? {
            speakerImage: newSegment.speakerImage,
            speakerName: newSegment.speakerName,
            speakerDesc: newSegment.speakerDesc,
          }
        : null,
      eventID: eventId || "",
      segmentDesc: newSegment.segmentDesc,
      startTime: newSegment.startTime,
      endTime: newSegment.endTime,
      isLocal: true,
    };

    const updatedSegments = [...segments, segmentToAdd];
    setSegments(updatedSegments);
    onSegmentUpdate(updatedSegments);
    resetForm();
  };

  // Handle editing an existing segment
  const handleEditSegment = (index) => {
    const segment = segments[index];
    setNewSegment({
      eventId: eventId || "",
      segmentId: segment.segmentId || "",
      segmentTitle: segment.segmentTitle || "",
      segmentDesc: segment.segmentDesc || "",
      speakerName: segment.speaker?.speakerName || "",
      speakerDesc: segment.speaker?.speakerDesc || "",
      speakerImage: segment.speaker?.speakerImage || "",
      startTime: segment.startTime || "",
      endTime: segment.endTime || "",
    });
    setDesc(!!segment.segmentDesc);
    setActor(!!segment.speaker);
    setIsEditing(true);
    setEditIndex(index);
    setIsAdding(true);
  };

  // Handle saving the edited segment
  const handleSaveEdit = () => {
    if (
      !newSegment.segmentTitle ||
      !newSegment.startTime ||
      !newSegment.endTime
    ) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please fill in all required fields (Title, Start Time, End Time).",
      });
      return;
    }
    if (actor && (!newSegment.speakerName || !newSegment.speakerDesc)) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please fill in Speaker Name and Speaker Description.",
      });
      return;
    }

    // Check for time overlap and event boundaries
    if (!checkTimeOverlap(newSegment.startTime, newSegment.endTime, editIndex)) {
      return;
    }

    const updatedSegment = {
      segmentId: newSegment.segmentId,
      segmentTitle: newSegment.segmentTitle,
      speaker: actor
        ? {
            speakerImage: newSegment.speakerImage,
            speakerName: newSegment.speakerName,
            speakerDesc: newSegment.speakerDesc,
          }
        : null,
      eventID: eventId || "",
      segmentDesc: newSegment.segmentDesc,
      startTime: newSegment.startTime,
      endTime: newSegment.endTime,
      isLocal: segments[editIndex]?.isLocal,
    };

    const updatedSegments = [...segments];
    updatedSegments[editIndex] = updatedSegment;
    setSegments(updatedSegments);
    onSegmentUpdate(updatedSegments);
    resetForm();
  };

  // Reset the form after adding or editing
  const resetForm = () => {
    setNewSegment({
      eventId: eventId || "",
      segmentId: "",
      segmentTitle: "",
      segmentDesc: "",
      speakerName: "",
      speakerDesc: "",
      speakerImage: "",
      speakerImageFile: null,
      startTime: "",
      endTime: "",
    });
    setDesc(false);
    setActor(false);
    setIsAdding(false);
    setIsEditing(false);
    setEditIndex(null);
  };

  // Handle deleting a segment
  const handleDeleteSegment = async (index) => {
    const segmentToDelete = segments[index];
    if (segmentToDelete.isLocal) {
      const updatedSegments = segments.filter((_, i) => i !== index);
      setSegments(updatedSegments);
      onSegmentUpdate(updatedSegments);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Segment deleted successfully",
      });
    } else if (segmentToDelete.segmentId) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/segment/delete/${segmentToDelete.segmentId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            method: "DELETE",
          }
        );

        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Segment deleted successfully",
          });
        } else {
          Swal.fire({
            icon: "warning",
            title: "Warning",
            text: "Failed to delete segment",
          });
        }
      } catch (error) {
        console.error("Error deleting segment:", error);

        Swal.fire({
          icon: "warning",
          title: "Warning",
          text: "An error occurred while deleting the segment",
        });
      }
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg border border-blue-500 max-w-[710px] w-full mb-4 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">Segments</h1>
      </div>
      <p className="text-gray-600 mb-6">
        Add an itinerary, schedule, or lineup to your event. You can include a
        time, a description of what will happen, and who will host or perform
        during the event.
      </p>
      <div className="flex items-center mb-4">
        <button className="text-blue-600 border-b-2 border-blue-600 pb-1 mr-4 font-medium">
          Segments
        </button>
        <button
          className="text-gray-500 hover:text-blue-600 pb-1 transition"
          onClick={() => setIsAdding(true)}
          disabled={loading}
        >
          + Add New Segment
        </button>
      </div>

      {/* Segment list */}
      {segments.length > 0 &&
        segments.map((segment, index) => (
          <div key={index} className="bg-red-50 p-4 rounded-lg mb-6 shadow-sm">
            <div className="border-red-500 border-l-2 pl-4">
              <div className="flex justify-between">
                <span className="text-red-500 font-medium">
                  {segment.startTime} - {segment.endTime}
                </span>
                <div className="space-x-2">
                  <i
                    className="fa-solid fa-pencil hover:text-blue-600 cursor-pointer"
                    onClick={() => handleEditSegment(index)}
                  ></i>
                  <i
                    className="fa-solid fa-trash hover:text-red-600 cursor-pointer"
                    onClick={() => handleDeleteSegment(index)}
                  ></i>
                </div>
              </div>
              <span className="font-semibold text-gray-800 text-xl py-2 block">
                {segment.segmentTitle}
              </span>
              <p className="text-gray-600 border-t-2 pt-2">
                {segment.segmentDesc}
              </p>
              {segment.speaker && (
                <div className="flex items-center mt-2">
                  {segment.speaker.speakerImage && (
                    <img
                      src={segment.speaker.speakerImage}
                      alt={segment.speaker.speakerName}
                      className="w-12 h-12 rounded-full object-cover mr-3"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/50?text=No+Image";
                      }}
                    />
                  )}
                  <p className="text-gray-600">
                    Speaker: {segment.speaker.speakerName} -{" "}
                    {segment.speaker.speakerDesc}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}

      {/* Popup form */}
      <SegmentFormPopup
        isOpen={isAdding}
        onClose={resetForm}
        newSegment={newSegment}
        handleChange={handleChange}
        handleImageUpload={handleImageUpload}
        desc={desc}
        setDesc={setDesc}
        actor={actor}
        setActor={setActor}
        onSave={isEditing ? handleSaveEdit : handleAddSlot}
        isEditing={isEditing}
        loading={loading}
      />
    </div>
  );
};

export default SectionEvent;