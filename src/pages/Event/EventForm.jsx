import React, { useState, useEffect } from "react";
import SectionEvent from "./SegmentEvent";
import UploadContainer from "./UploadImg";
import DatetimeLocation from "./EventDateLocate";
import OverviewSection from "./OverviewSection";
import Loader from "../../components/Loading";

const EventForm = ({ event, setEvent, onNext }) => {
  const [showOverview, setShowOverview] = useState(false); 
  const [loading, setLoading] = useState(true);

  // Hàm cập nhật eventLocation
  const handleLocationUpdate = (updatedLocation) => {
    console.log("cap nhat lan 2:", updatedLocation);
    setEvent((prevEvent) => ({
      ...prevEvent,
      eventLocation: updatedLocation,
    }));
  };
// Hàm cập nhật segment 
const handleSegmentUpdate = (updatedSegments) => {
  setEvent((prevEvent) => ({
    ...prevEvent,
    segment: updatedSegments,
  }));

};
  // Hàm cập nhật overviewContent
  const handleContentUpdate = (newContent) => {
    setEvent((prev) => ({
      ...prev,
      overviewContent: newContent,
    }));
  };

  // Hàm cập nhật uploadedImages
  const handleImagesUpdate = (newImages) => {
    setEvent((prev) => ({
      ...prev,
      uploadedImages: newImages,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
const debug =(e) =>{
  console.log(e)
}
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <div className="max-w-3xl mx-auto p-4">
      {/* Image Upload Section */}
      <UploadContainer
        uploadedImages={event.uploadedImages || []}
        setUploadedImages={handleImagesUpdate}
      />

      {/* Event Overview Section */}
      {!showOverview ? (
        <div
          className="bg-white border border-blue-500 rounded-lg p-6 w-full max-w-[710px] mb-4"
          onClick={() => setShowOverview(true)}
        >
          <h2 className="text-5xl font-semibold mb-2">
            {event.eventName || "Untitled Event"}
          </h2>
          <span>{event.eventDesc || "No summary provided"}</span>
        </div>
      ) : (
        <div className="bg-white border border-blue-500 rounded-lg p-6 w-full max-w-[710px] mb-4">
          <h1 className="text-2xl font-bold mb-6">Event Overview</h1>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Event title</h2>
            <label className="block">
              <input
                type="text"
                name="eventName"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 p-2"
                value={event.eventName || ""}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Summary</h2>
            <label className="block">
              <textarea
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 p-2"
                rows="3"
                name="eventDesc"
                value={event.eventDesc || ""}
                onChange={handleChange}
              />
            </label>
            <div className="text-right text-gray-600 mt-1">
              {(event.eventDesc || "").length} / 140
            </div>
          </div>

          <div className="text-blue-500 flex items-center">
            <i className="fas fa-bolt mr-2"></i>
            <a href="#" className="font-semibold">
              Suggest summary
            </a>
          </div>
        </div>
      )}

      <SectionEvent segmentData = {event.segment} onSegmentUpdate={handleSegmentUpdate}/>
      <DatetimeLocation
        locationData={event.eventLocation || {}}
        onLocationUpdate={handleLocationUpdate}
        onChange={debug(event.eventLocation)}
      />
      <OverviewSection
        content={event.overviewContent || { text: "", media: [] }}
        setContent={handleContentUpdate}
      />

      {/* Save Button */}
      <div className="text-right">
        <button
          className="bg-orange-600 text-white px-6 py-2 rounded-lg"
          onClick={onNext}
        >
          Save and continue
        </button>
      </div>
    </div>
  );
};

export default EventForm;