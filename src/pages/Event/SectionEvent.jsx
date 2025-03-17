import { useState, useRef } from "react";
import { FaUser, FaList } from "react-icons/fa";

const SectionEvent = () => {
  const [slots, setSlots] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [desc, setDesc] = useState(false);
  const [artist, setArtist] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const addSectionRef = useRef(null);

  const handleClickOutside = (event) => {
    if (
      addSectionRef.current &&
      !addSectionRef.current.contains(event.target)
    ) {
      if (title.trim() !== "" && startTime && endTime) {
        setSlots([...slots, { title, startTime, endTime, description }]);
        setTitle("");
        setStartTime("");
        setEndTime("");
        setDescription("");
        setDesc(false);
        setArtist(false);
        setIsAdding(false);
      }
    }
  };

  const handleAddSlot = () => {
    setIsAdding(true);
  };

  return (
    <div
      className="bg-white p-8 rounded-lg  border border-blue-500 max-w-[710px] w-full mb-4"
      onClick={handleClickOutside}
    >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Agenda</h1>
        <button className="text-red-500">Delete section</button>
      </div>
      <p className="text-gray-600 mb-6">
        Add an itinerary, schedule, or lineup to your event. You can include a
        time, a description of what will happen, and who will host or perform
        during the event.
      </p>
      <div className="flex items-center mb-4">
        <button className="text-blue-600 border-b-2 border-blue-600 pb-1 mr-4">
          Agenda
        </button>
        <button className="text-gray-500 pb-1" onClick={handleAddSlot}>
          + Add new agenda
        </button>
      </div>

      {/* Danh sách agenda slots */}
      {slots.map((slot, index) => (
        <div key={index} className="bg-red-50 p-4 rounded-lg mb-6">
          <div className="border-red-500 border-l-2 pl-4">
            <div className="flex justify-between">
              <span className="text-red-500">
                {slot.startTime} - {slot.endTime}
              </span>
              <i className="fa-solid fa-pencil hover:text-blue-600 hover:cursor-pointer"></i>
            </div>
            <span className="font-semibold text-gray-500 text-xl py-2">
              {slot.title}
            </span>
            <p className="text-gray-500 border-t-2 pt-2">{slot.description}</p>
          </div>
        </div>
      ))}

      {/* Form thêm slot */}
      {isAdding && (
        <div ref={addSectionRef} className="p-4 border border-gray-300 rounded-lg">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="title">
              Title<span className="text-red-500">*</span>
            </label>
            <input
              className="w-full p-2 border border-gray-300 rounded-lg"
              type="text"
              id="title"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex space-x-4 mb-4">
            <div className="flex-1">
              <label className="block text-gray-700 mb-2" htmlFor="start-time">
                Start time
              </label>
              <input
                type="time"
                id="start-time"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 mb-2" htmlFor="end-time">
                End time
              </label>
              <input
                type="time"
                id="end-time"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <div className="text-right text-gray-400 text-xs">
                  {description.length} / 1000
                </div>
              </div>
            )}
            {!artist ? (
              <button
                className="flex items-center text-gray-600 mt-2 text-[14px] mb-2"
                onClick={() => setArtist(true)}
              >
                <FaUser className="mr-2" /> Add Artist
              </button>
            ) : (
              <div>
                <label className="block text-gray-600 mt-2 text-[14px] mb-2">
                  Artist
                </label>
                <textarea
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  rows="3"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                />
                <div className="text-right text-gray-400 text-xs">
                  {artist.length} / 1000
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-gray-100 p-4 rounded-lg text-center mt-4">
        <button className="text-blue-600 w-full" onClick={handleAddSlot}>
          + Add slot
        </button>
      </div>
    </div>
  );
};

export default SectionEvent;
