const EventList = ({ event }) => {
    // Kiểm tra nếu event là một mảng hoặc một object
    const events = Array.isArray(event) ? event : event ? [event] : [];
  
    return (
      <div className="w-full md:w-3/4 md:ml-4 mt-4 md:mt-0">
        {events.length > 0 ? (
          events.map((evt, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md mb-4">
              <div className="flex justify-between items-center">
                {/* Hình ảnh & thông tin cơ bản */}
                <div className="flex items-center">
                  <img
                    alt="Event poster"
                    className="w-16 h-16 rounded-lg mr-4"
                    src={evt.event_image}
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{evt.event_name}</h3>
                    <p className="text-gray-500">{evt.event_host}</p>
                    <div className="flex space-x-2 mt-1">
                      <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded">
                        {evt.event_location}
                      </span>
                      <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded">
                        {evt.event_status}
                      </span>
                    </div>
                    <p className="text-gray-500 mt-1">{evt.event_type}</p>
                  </div>
                </div>
                {/* Thời gian sự kiện */}
                <div className="text-right">
                  <p className="text-green-500 font-semibold">
                    {new Date(evt.event_start).toLocaleDateString()} -{" "}
                    {new Date(evt.event_end).toLocaleDateString()}
                  </p>
                  <p className="text-gray-500">
                    Bắt đầu: {new Date(evt.event_start).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center mt-4">Không có sự kiện nào.</p>
        )}
      </div>
    );
  };
  
  export default EventList;
  