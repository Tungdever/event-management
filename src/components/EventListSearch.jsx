import { useState } from "react";
import { FaUserFriends, FaHeart, FaShareAlt } from "react-icons/fa";

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const EventList = ({ event }) => {
  const [imageError, setImageError] = useState({});

  const handleImageError = (eventId) => {
    setImageError((prev) => ({ ...prev, [eventId]: true }));
  };

  if (!event || event.length === 0) {
    return (
      <div className="max-w-5xl mx-auto p-6 border-l-2 text-center">
        <p className="text-gray-500 text-lg">Không tìm thấy sự kiện nào.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="space-y-6">
        {event.map((eventItem) => (
          <div
            key={eventItem.eventId}
            className="flex items-center w-[730px] bg-white shadow rounded-[8px] overflow-hidden p-4 hover:shadow-lg transition-all duration-300 border border-gray-200"
          >
            {imageError[eventItem.eventId] || 
            !eventItem.eventImages || 
            eventItem.eventImages.length === 0 || 
            !isValidUrl(eventItem.eventImages[0]) ? (
              <div className="w-44 h-28 bg-gray-200 flex items-center justify-center rounded-lg">
                <p className="text-gray-500 text-sm">Hình ảnh không tải được</p>
              </div>
            ) : (
              <img
                src={eventItem.eventImages[0]}
                alt={eventItem.eventName}
                className="w-44 h-28 object-cover rounded-lg"
                onError={() => handleImageError(eventItem.eventId)}
              />
            )}
            <div className="ml-4 flex-1 text-[13px]">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{eventItem.eventName}</h3>
              <div className="flex space-x-6 my-2">
                <p className="font-medium text-red-500 bg-blue-100 px-[4px] py-[2px] rounded-[4px]">{eventItem.eventType}</p>
                <p className="text-gray-500 px-[4px] py-[2px]">{eventItem.eventStart}</p>
              </div>
              <p className="text-gray-600">
                <i className="fa-solid fa-location-dot mr-2 text-orange-300"></i>
                {eventItem.eventLocation.venueName}
              </p>
              <div className="flex items-center text-gray-600 mt-1">
                <FaUserFriends className="mr-2 text-blue-500" /> {eventItem.eventHost}
              </div>
            </div>
            <div className="flex flex-col items-center ml-6 space-y-3">
              <button className="p-2 rounded-full bg-gray-100 hover:bg-red-100 text-red-500 transition duration-200 ease-in-out hover:scale-110">
                <FaHeart size={18} />
              </button>
              <button className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 text-blue-500 transition duration-200 ease-in-out hover:scale-110">
                <FaShareAlt size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;