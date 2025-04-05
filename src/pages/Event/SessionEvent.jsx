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
        <i className="fa-solid fa-image text-gray-600 text-xl"></i>
      )}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
};
const SectionEvent = ({ eventId, sessionData, onSessionUpdate }) => {
  const [sessions, setSessions] = useState(sessionData || []);
  const [speakerImageData, setSpeakerImageData] = useState(null); 
  const [newSession, setNewSession] = useState({
    eventId: eventId || "",
    sessionId: "",
    sessionTitle: "",
    sessionDesc: "",
    speakerName: "",
    speakerDesc: "",
    startTime: "",
    endTime: "",
  });
  const [desc, setDesc] = useState(false);
  const [actor, setActor] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSession((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageUpload = ({ file, imageUrl, publicId }) => {
    setSpeakerImageData({ file, imageUrl, publicId });
  };

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
            speakerImage: speakerImageData?.imageUrl || "", 
            speakerName: newSession.speakerName,
            speakerDesc: newSession.speakerDesc,
          }
        : null,
      eventID: eventId || "",
      sessionDesc: newSession.sessionDesc,
      startTime: newSession.startTime, 
      endTime: newSession.endTime,    
    };

    
    const updatedSessions = [...sessions, sessionToAdd];
    setSessions(updatedSessions); 
    onSessionUpdate(updatedSessions); 
    console.log(updatedSessions)
    
    setNewSession({
      eventId: eventId || "",
      sessionId: "",
      sessionTitle: "",
      sessionDesc: "",
      speakerName: "",
      speakerDesc: "",
      startTime: "",
      endTime: "",
    });
    setSpeakerImageData(null);
    setDesc(false);
    setActor(false);
    setIsAdding(false);
  };

  return (
    <div className="bg-white p-8 rounded-lg border border-blue-500 max-w-[710px] w-full mb-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Session</h1>
        <button className="text-red-500">Delete section</button>
      </div>
      <p className="text-gray-600 mb-6">
        Add an itinerary, schedule, or lineup to your event. You can include a
        time, a description of what will happen, and who will host or perform
        during the event.
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
      {sessions.length > 0 && (
        sessions.map((session, index) => (
          <div key={index} className="bg-red-50 p-4 rounded-lg mb-6">
            <div className="border-red-500 border-l-2 pl-4">
              <div className="flex justify-between">
                <span className="text-red-500">
                  {session.startTime} - {session.endTime}
                </span>
                <i className="fa-solid fa-pencil hover:text-blue-600 hover:cursor-pointer"></i>
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
        ))
      )}

      {/* Form thêm session */}
      {isAdding && (
        <div className="p-4 border border-gray-300 rounded-lg">
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
                <div className="flex space-x-4 mb-4">
                  <input
                    className="w-[200px] p-2 border border-gray-300 rounded-lg"
                    type="text"
                    id="speakerName"
                    placeholder="Speaker Name"
                    name="speakerName"
                    value={newSession.speakerName}
                    onChange={handleChange}
                  />
                  <ImageUploader onImageUpload={handleImageUpload} />
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
          <button
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
            onClick={handleAddSlot}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Session"}
          </button>
        </div>
      )}

      {!isAdding && (
        <div className="bg-gray-100 p-4 rounded-lg text-center mt-4">
          <button className="text-blue-600 w-full" onClick={() => setIsAdding(true)}>
            + Add slot
          </button>
        </div>
      )}
    </div>
  );
};

export default SectionEvent;