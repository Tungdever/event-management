import { FaUserFriends, FaHeart, FaShareAlt } from "react-icons/fa";

const EventList = ({ event }) => { 
 
  if (!event || event.length === 0) {
    return (
      <div className="max-w-5xl mx-auto p-6 border-l-2 text-center">
        <p className="text-gray-500 text-lg">Không tìm thấy sự kiện nào.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 border-l-2">
      <div className="space-y-6">
        {event.map((eventItem) => (
          <div
            key={eventItem.eventId}
            className="flex items-center w-[700px] bg-white shadow-lg rounded-xl overflow-hidden p-4 hover:shadow-xl transition-all duration-300 border border-gray-200"
          >
            {/* Hình ảnh sự kiện */}
            <img
              src={eventItem.eventImages && eventItem.eventImages.length > 0 ? `${eventItem.eventImages[0]}` : "https://via.placeholder.com/150"} // Lấy ảnh đầu tiên hoặc ảnh placeholder
              alt={eventItem.eventName}
              className="w-44 h-24 object-cover rounded-lg"
              onError={(e) => (e.target.src = "https://via.placeholder.com/150")} // Xử lý lỗi ảnh
            />

            {/* Thông tin sự kiện */}
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{eventItem.eventName}</h3> {/* Đổi eventDesc thành eventName */}
              <p className="text-sm text-gray-500">{eventItem.eventStart}</p>
              <p className="text-sm font-medium text-red-500">{eventItem.eventType}</p>
              <p className="text-sm text-gray-600">{eventItem.eventHost}</p>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <FaUserFriends className="mr-1 text-blue-500" /> {eventItem.eventLocation.venueName}
              </div>
            </div>

            {/* Nút hành động */}
            <div className="flex flex-col items-center ml-6 space-y-3">
              <button className="p-2 rounded-full bg-gray-100 hover:bg-red-100 text-red-500 transition-all duration-200">
                <FaHeart size={18} />
              </button>
              <button className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 text-blue-500 transition-all duration-200">
                <FaShareAlt size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default EventList