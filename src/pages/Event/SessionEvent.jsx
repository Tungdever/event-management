import { useState, useRef } from "react";
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

const SessionFormPopup = ({ 
  isOpen, 
  onClose, 
  newSession, 
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
            id="sessionTitle"
            placeholder="Title"
            name="sessionTitle"
            value={newSession.sessionTitle}
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
              value={newSession.startTime}
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
              value={newSession.endTime}
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
                name="sessionDesc"
                value={newSession.sessionDesc}
                onChange={handleChange}
              />
              <div className="text-right text-gray-400 text-xs">
                {newSession.sessionDesc.length} / 1000
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
                  value={newSession.speakerName}
                  onChange={handleChange}
                />
                {newSession.speakerImage ? (
                  <div className="relative">
                    <img
                      src={newSession.speakerImage}
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
                value={newSession.speakerDesc}
                onChange={handleChange}
              />
              <div className="text-right text-gray-400 text-xs">
                {newSession.speakerDesc.length} / 1000
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
            {loading ? "Saving..." : isEditing ? "Save Changes" : "Save Session"}
          </button>
        </div>
      </div>
    </div>
  );
};

const SectionEvent = ({ eventId, sessionData, onSessionUpdate }) => {
  const [sessions, setSessions] = useState(sessionData || []);
  const [newSession, setNewSession] = useState({
    eventId: eventId || "",
    sessionId: "",
    sessionTitle: "",
    sessionDesc: "",
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

  // Load sessions from API
  const loadSessions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/session/${eventId}/getSession`);
      setSessions(response.data);
      onSessionUpdate(response.data);
    } catch (error) {
      console.error("Error loading sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSession((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageUpload = (data) => {
    setNewSession((prevData) => ({
      ...prevData,
      speakerImage: data ? data.imageUrl : "" // Update speakerImage directly
    }));
  };

  // Handle adding a new session
  const handleAddSlot = () => {
    if (!newSession.sessionTitle || !newSession.startTime || !newSession.endTime) {
      alert("Please fill in all required fields (Title, Start Time, End Time).");
      return;
    }
    if (actor && (!newSession.speakerName || !newSession.speakerDesc)) {
      alert("Please fill in Speaker Name and Description.");
      return;
    }

    const sessionToAdd = {
      sessionTitle: newSession.sessionTitle,
      speaker: actor
        ? {
            speakerImage: newSession.speakerImage,
            speakerName: newSession.speakerName,
            speakerDesc: newSession.speakerDesc,
          }
        : null,
      eventID: eventId || "",
      sessionDesc: newSession.sessionDesc,
      startTime: newSession.startTime,
      endTime: newSession.endTime,
      isLocal: true
    };

    const updatedSessions = [...sessions, sessionToAdd];
    setSessions(updatedSessions);
    onSessionUpdate(updatedSessions);
    resetForm();
  };

  // Handle editing an existing session
  const handleEditSession = (index) => {
    const session = sessions[index];
    setNewSession({
      eventId: eventId || "",
      sessionId: session.sessionId || "",
      sessionTitle: session.sessionTitle || "",
      sessionDesc: session.sessionDesc || "",
      speakerName: session.speaker?.speakerName || "",
      speakerDesc: session.speaker?.speakerDesc || "",
      speakerImage: session.speaker?.speakerImage || "", // Include speakerImage
      startTime: session.startTime || "",
      endTime: session.endTime || "",
    });
    setDesc(!!session.sessionDesc);
    setActor(!!session.speaker);
    setIsEditing(true);
    setEditIndex(index);
    setIsAdding(true);
  };

  // Handle saving the edited session
  const handleSaveEdit = () => {
    if (!newSession.sessionTitle || !newSession.startTime || !newSession.endTime) {
      alert("Please fill in all required fields (Title, Start Time, End Time).");
      return;
    }
    if (actor && (!newSession.speakerName || !newSession.speakerDesc)) {
      alert("Please fill in Speaker Name and Description.");
      return;
    }

    const updatedSession = {
      sessionId: newSession.sessionId,
      sessionTitle: newSession.sessionTitle,
      speaker: actor
        ? {
            speakerImage: newSession.speakerImage,
            speakerName: newSession.speakerName,
            speakerDesc: newSession.speakerDesc,
          }
        : null,
      eventID: eventId || "",
      sessionDesc: newSession.sessionDesc,
      startTime: newSession.startTime,
      endTime: newSession.endTime,
      isLocal: sessions[editIndex]?.isLocal
    };

    const updatedSessions = [...sessions];
    updatedSessions[editIndex] = updatedSession;
    setSessions(updatedSessions);
    onSessionUpdate(updatedSessions);
    resetForm();
  };

  // Reset the form after adding or editing
  const resetForm = () => {
    setNewSession({
      eventId: eventId || "",
      sessionId: "",
      sessionTitle: "",
      sessionDesc: "",
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

  // Handle deleting a session
  const handleDeleteSession = async (index) => {
    const sessionToDelete = sessions[index];
    
    if (sessionToDelete.isLocal) {
      const updatedSessions = sessions.filter((_, i) => i !== index);
      setSessions(updatedSessions);
      onSessionUpdate(updatedSessions);
      alert("Delete session successful");
    } 
    else if (sessionToDelete.sessionId) {
      try {
        const response = await fetch(`http://localhost:8080/api/session/delete/${sessionToDelete.sessionId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("Delete session successful");
          
        } else {
          alert("Failed to delete session");
        }
      } catch (error) {
        console.error("Error deleting session:", error);
        alert("An error occurred while deleting the session");
      }
    }
  };

 

  return (
    <div className="bg-white p-8 rounded-lg border border-blue-500 max-w-[710px] w-full mb-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Session</h1>
      </div>
      <p className="text-gray-600 mb-6">
        Add an itinerary, schedule, or lineup to your event. You can include a time, a description of what will happen, and who will host or perform during the event.
      </p>
      <div className="flex items-center mb-4">
        <button className="text-blue-600 border-b-2 border-blue-600 pb-1 mr-4">
          Session
        </button>
        <button
          className="text-gray-500 pb-1"
          onClick={() => setIsAdding(true)}
          disabled={loading}
        >
          + Add new session
        </button>
      </div>

      {/* Danh sách sessions */}
      {sessions.length > 0 &&
        sessions.map((session, index) => (
          <div key={index} className="bg-red-50 p-4 rounded-lg mb-6">
            <div className="border-red-500 border-l-2 pl-4">
              <div className="flex justify-between">
                <span className="text-red-500">
                  {session.startTime} - {session.endTime}
                </span>
                <div className="space-x-2">
                  <i
                    className="fa-solid fa-pencil hover:text-blue-600 hover:cursor-pointer"
                    onClick={() => handleEditSession(index)}
                  ></i>
                  <i
                    className="fa-solid fa-trash hover:text-red-600 hover:cursor-pointer"
                    onClick={() => handleDeleteSession(index)}
                  ></i>
                </div>
              </div>
              <span className="font-semibold text-gray-500 text-xl py-2">
                {session.sessionTitle}
              </span>
              <p className="text-gray-500 border-t-2 pt-2">{session.sessionDesc}</p>
              {session.speaker && (
                <div className="flex items-center mt-2">
                  {session.speaker.speakerImage && (
                    <img
                      src={session.speaker.speakerImage}
                      alt={session.speaker.speakerName}
                      className="w-12 h-12 rounded-full object-cover mr-3"
                    />
                  )}
                  <p className="text-gray-500">
                    Speaker: {session.speaker.speakerName} - {session.speaker.speakerDesc}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}

      {/* Popup form */}
      <SessionFormPopup
        isOpen={isAdding}
        onClose={resetForm}
        newSession={newSession}
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