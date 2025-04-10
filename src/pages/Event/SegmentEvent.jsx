import { useState, useRef, useEffect } from "react";
import { FaList, FaUser } from "react-icons/fa";
import axios from "axios";

const ImageUploader = ({ onImageUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file.");
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
      className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-full w-[50px] h-[50px] cursor-pointer overflow-hidden"
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
  loading 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[100vh] overflow-y-auto">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 text-[14px]" htmlFor="title">
            Title<span className="text-red-500">*</span>
          </label>
          <input
            className="w-full p-2 border border-gray-300 rounded-lg"
            type="text"
            id="segmentTitle"
            placeholder="Title"
            name="segmentTitle"
            value={newSegment.segmentTitle}
            onChange={handleChange}
          />
        </div>
        <div className="flex space-x-4 mb-4">
          <div className="flex-1">
            <label className="block text-gray-700 mb-2 text-[14px]" htmlFor="start-time">
              Start time<span className="text-red-500">*</span>
            </label>
            <input
              className="w-full p-2 border border-gray-300 rounded-lg"
              type="time"
              id="start-time"
              name="startTime"
              value={newSegment.startTime}
              onChange={handleChange}
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 mb-2 text-[14px]" htmlFor="end-time">
              End time<span className="text-red-500">*</span>
            </label>
            <input
              className="w-full p-2 border border-gray-300 rounded-lg"
              type="time"
              id="end-time"
              name="endTime"
              value={newSegment.endTime}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex flex-col">
          {!desc ? (
            <button
              className="flex items-center text-gray-600 mt-2 text-[14px] mb-2"
              onClick={() => setDesc(true)}
            >
              <FaList className="mr-2" /> Add description
            </button>
          ) : (
            <div>
              <label className="block text-gray-600 mt-2 text-[14px] mb-2">
                Description
              </label>
              <textarea
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                rows="3"
                name="segmentDesc"
                value={newSegment.segmentDesc}
                onChange={handleChange}
              />
              <div className="text-right text-gray-400 text-xs">
                {newSegment.segmentDesc.length} / 1000
              </div>
            </div>
          )}
          {!actor ? (
            <button
              className="flex items-center text-gray-600 mt-2 text-[14px] mb-2"
              onClick={() => setActor(true)}
            >
              <FaUser className="mr-2" /> Add Speaker
            </button>
          ) : (
            <div>
              <label className="block text-gray-600 mt-2 text-[14px] mb-2">
                Speaker Name <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-4 mb-4 items-center">
                <input
                  className="w-[200px] p-2 border border-gray-300 rounded-lg"
                  type="text"
                  id="speakerName"
                  placeholder="Speaker Name"
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
                    {/* <ImageUploader onImageUpload={handleImageUpload} /> */}
                  </div>
                ) : (
                  <ImageUploader onImageUpload={handleImageUpload} />
                )}
              </div>
              <label className="block text-gray-600 mt-2 text-[14px] mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                rows="3"
                name="speakerDesc"
                value={newSegment.speakerDesc}
                onChange={handleChange}
              />
              <div className="text-right text-gray-400 text-xs">
                {newSegment.speakerDesc.length} / 1000
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end mt-4 space-x-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded-lg"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            onClick={onSave}
            disabled={loading}
          >
            {loading ? "Saving..." : isEditing ? "Save Changes" : "Save Segment"}
          </button>
        </div>
      </div>
    </div>
  );
};

const SectionEvent = ({ eventId, segmentData, onSegmentUpdate }) => {
  const [segments, setSegments] = useState(segmentData || []);
  const [newSegment, setNewSegment] = useState({
    eventId: eventId || "",
    segmentId: "",
    segmentTitle: "",
    segmentDesc: "",
    speakerName: "",
    speakerDesc: "",
    speakerImage: "", 
    startTime: "",
    endTime: "",
  });
  const [desc, setDesc] = useState(false);
  const [actor, setActor] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load segments from API
  const loadSegments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/segment/${eventId}`);
      setSegments(response.data);
      onSegmentUpdate(response.data);
    } catch (error) {
      console.error("Error loading segments:", error);
    } finally {
      setLoading(false);
    }
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
      speakerImage: data ? data.imageUrl : "" // Update speakerImage directly
    }));
  };

  // Handle adding a new segment
  const handleAddSlot = () => {
    if (!newSegment.segmentTitle || !newSegment.startTime || !newSegment.endTime) {
      alert("Please fill in all required fields (Title, Start Time, End Time).");
      return;
    }
    if (actor && (!newSegment.speakerName || !newSegment.speakerDesc)) {
      alert("Please fill in Speaker Name and Description.");
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
      isLocal: true
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
      speakerImage: segment.speaker?.speakerImage || "", // Include speakerImage
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
    if (!newSegment.segmentTitle || !newSegment.startTime || !newSegment.endTime) {
      alert("Please fill in all required fields (Title, Start Time, End Time).");
      return;
    }
    if (actor && (!newSegment.speakerName || !newSegment.speakerDesc)) {
      alert("Please fill in Speaker Name and Description.");
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
      isLocal: segments[editIndex]?.isLocal
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
      speakerImage: "", // Reset speakerImage
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
      alert("Delete segment successful");
    } 
    else if (segmentToDelete.segmentId) {
      try {
        const response = await fetch(`http://localhost:8080/api/segment/delete/${segmentToDelete.segmentId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("Delete segment successful");
          await loadSegments();
        } else {
          alert("Failed to delete segment");
        }
      } catch (error) {
        console.error("Error deleting segment:", error);
        alert("An error occurred while deleting the segment");
      }
    }
  };

  // Load segments on component mount
  useEffect(() => {
    loadSegments();
  }, [eventId]);

  return (
    <div className="bg-white p-8 rounded-lg border border-blue-500 max-w-[710px] w-full mb-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Segment</h1>
      </div>
      <p className="text-gray-600 mb-6">
        Add an itinerary, schedule, or lineup to your event. You can include a time, a description of what will happen, and who will host or perform during the event.
      </p>
      <div className="flex items-center mb-4">
        <button className="text-blue-600 border-b-2 border-blue-600 pb-1 mr-4">
          Segment
        </button>
        <button
          className="text-gray-500 pb-1"
          onClick={() => setIsAdding(true)}
          disabled={loading}
        >
          + Add new segment
        </button>
      </div>

      {/* Danh sách segments */}
      {segments.length > 0 &&
        segments.map((segment, index) => (
          <div key={index} className="bg-red-50 p-4 rounded-lg mb-6">
            <div className="border-red-500 border-l-2 pl-4">
              <div className="flex justify-between">
                <span className="text-red-500">
                  {segment.startTime} - {segment.endTime}
                </span>
                <div className="space-x-2">
                  <i
                    className="fa-solid fa-pencil hover:text-blue-600 hover:cursor-pointer"
                    onClick={() => handleEditSegment(index)}
                  ></i>
                  <i
                    className="fa-solid fa-trash hover:text-red-600 hover:cursor-pointer"
                    onClick={() => handleDeleteSegment(index)}
                  ></i>
                </div>
              </div>
              <span className="font-semibold text-gray-500 text-xl py-2">
                {segment.segmentTitle}
              </span>
              <p className="text-gray-500 border-t-2 pt-2">{segment.segmentDesc}</p>
              {segment.speaker && (
                <div className="flex items-center mt-2">
                  {segment.speaker.speakerImage && (
                    <img
                      src={segment.speaker.speakerImage}
                      alt={segment.speaker.speakerName}
                      className="w-12 h-12 rounded-full object-cover mr-3"
                    />
                  )}
                  <p className="text-gray-500">
                    Speaker: {segment.speaker.speakerName} - {segment.speaker.speakerDesc}
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