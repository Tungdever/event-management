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

      // Upload ảnh lên Cloudinary qua API
      const formData = new FormData();
      formData.append("file", file);
      try {
        const response = await axios.post("http://localhost:8080/api/storage/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const publicId = response.data.replace("File uploaded: ", "").trim();
        onImageUpload({ file, imageUrl, publicId }); 
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image.");
      }
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
const SectionEvent = ({ eventId }) => {
  const [segments, setSegments] = useState([]);
  const [speakerImageData, setSpeakerImageData] = useState(null); 
  const [newSegment, setNewSegment] = useState({
    eventId: eventId || "",
    segmentId: "",
    segmentTitle: "",
    segmentDesc: "",
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
    setNewSegment((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageUpload = ({ file, imageUrl, publicId }) => {
    setSpeakerImageData({ file, imageUrl, publicId });
  };

  const handleAddSlot = async () => {
    if (!newSegment.segmentTitle || !newSegment.startTime || !newSegment.endTime) {
      alert("Please fill in all required fields (Title, Start Time, End Time).");
      return;
    }
    if (actor && (!newSegment.speakerName || !newSegment.speakerDesc)) {
      alert("Please fill in Speaker Name and Description.");
      return;
    }

    setLoading(true);
    const currentDate = new Date().toISOString().split("T")[0]; 
    const postData = {
      segmentTitle: newSegment.segmentTitle,
      speaker: actor
        ? {
           
            speakerImage: speakerImageData?.publicId || "", 
            speakerName: newSegment.speakerName,
            speakerDesc: newSegment.speakerDesc,
          }
        : null,
      eventID: eventId,
      segmentDesc: newSegment.segmentDesc,
      startTime: `${currentDate}T${newSegment.startTime}:00.000+00:00`,
      endTime: `${currentDate}T${newSegment.endTime}:00.000+00:00`,
    };

    try {
      const response = await axios.post(`http://localhost:8080/api/segment/${eventId}`, postData);
      alert("Segment added successfully!");
      setSegments((prev) => [...prev, response.data]);
      setNewSegment({
        eventId: eventId || "",
        segmentId: "",
        segmentTitle: "",
        segmentDesc: "",
        speakerName: "",
        speakerDesc: "",
        startTime: "",
        endTime: "",
      });
      setSpeakerImageData(null);
      setDesc(false);
      setActor(false);
      setIsAdding(false);
    } catch (error) {
      console.error("Error adding segment:", error);
      alert("Failed to add segment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg border border-blue-500 max-w-[710px] w-full mb-4">
      {/* Danh sách segments */}
      {segments.map((segment, index) => (
        <div key={index} className="bg-red-50 p-4 rounded-lg mb-6">
          <div className="border-red-500 border-l-2 pl-4">
            <div className="flex justify-between">
              <span className="text-red-500">
                {segment.startTime.split("T")[1].substring(0, 5)} -{" "}
                {segment.endTime.split("T")[1].substring(0, 5)}
              </span>
              <i className="fa-solid fa-pencil hover:text-blue-600 hover:cursor-pointer"></i>
            </div>
            <span className="font-semibold text-gray-500 text-xl py-2">
              {segment.segmentTitle}
            </span>
            <p className="text-gray-500 border-t-2 pt-2">{segment.segmentDesc}</p>
            {segment.speaker && (
              
                <p className="text-gray-500">

                Speaker: {segment.speaker.speakerName} - {segment.speaker.speakerDesc}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SectionEvent;