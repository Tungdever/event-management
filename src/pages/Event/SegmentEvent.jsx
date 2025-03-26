import { useState, useRef, useEffect } from "react";
import { FaList, FaUser } from "react-icons/fa";

const SectionEvent = () => {
  // segments là mảng để lưu danh sách các segment
  const [segments, setSegments] = useState([]);
  
  // newSegment để lưu dữ liệu của segment đang được thêm
  const [newSegment, setNewSegment] = useState({
    eventId: "",
    segmentId: "",
    segmentTitle: "",
    segmentDesc: "",
    speakerName: "",
    startTime: "",
    endTime: "",
  });

  const [desc, setDesc] = useState(false);
  const [actor, setActor] = useState(false); // Sửa artist thành actor cho nhất quán
  const [isAdding, setIsAdding] = useState(false);
  const addSectionRef = useRef(null);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSegment((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Xử lý nhấp chuột bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        addSectionRef.current &&
        !addSectionRef.current.contains(event.target) &&
        isAdding
      ) {
        if (
          newSegment.segmentTitle.trim() !== "" &&
          newSegment.startTime &&
          newSegment.endTime
        ) {
          setSegments((prev) => [...prev, { ...newSegment }]);
          // Reset form sau khi thêm
          setNewSegment({
            eventId: "",
            segmentId: "",
            segmentTitle: "",
            segmentDesc: "",
            speakerName: "",
            startTime: "",
            endTime: "",
          });
          setDesc(false);
          setActor(false);
          setIsAdding(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [newSegment, isAdding]);

  const handleAddSlot = () => {
    setIsAdding(true);
  };

  return (
    <div className="bg-white p-8 rounded-lg border border-blue-500 max-w-[710px] w-full mb-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Segment</h1>
        <button className="text-red-500">Delete section</button>
      </div>
      <p className="text-gray-600 mb-6">
        Add an itinerary, schedule, or lineup to your event. You can include a
        time, a description of what will happen, and who will host or perform
        during the event.
      </p>
      <div className="flex items-center mb-4">
        <button className="text-blue-600 border-b-2 border-blue-600 pb-1 mr-4">
          Segment
        </button>
        <button className="text-gray-500 pb-1" onClick={handleAddSlot}>
          + Add new segment
        </button>
      </div>

      {/* Danh sách agenda slots */}
      {segments.map((segment, index) => (
        <div key={index} className="bg-red-50 p-4 rounded-lg mb-6">
          <div className="border-red-500 border-l-2 pl-4">
            <div className="flex justify-between">
              <span className="text-red-500">
                {segment.startTime} - {segment.endTime}
              </span>
              <i className="fa-solid fa-pencil hover:text-blue-600 hover:cursor-pointer"></i>
            </div>
            <span className="font-semibold text-gray-500 text-xl py-2">
              {segment.segmentTitle}
            </span>
            <p className="text-gray-500 border-t-2 pt-2">{segment.segmentDesc}</p>
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
              id="segmentTitle"
              placeholder="Title"
              name="segmentTitle"
              value={newSegment.segmentTitle}
              onChange={handleChange}
            />
          </div>
          <div className="flex space-x-4 mb-4">
            <div className="flex-1">
              <label className="block text-gray-700 mb-2" htmlFor="start-time">
                Start time
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
              <label className="block text-gray-700 mb-2" htmlFor="end-time">
                End time
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
                  name="speakerName"
                  value={newSegment.speakerName}
                  onChange={handleChange}
                />
                <div className="text-right text-gray-400 text-xs">
                  {newSegment.speakerName.length} / 1000
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