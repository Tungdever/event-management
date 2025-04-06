
import React, { useState ,useEffect,useRef} from "react";
import { FaSearch, FaEllipsisV, FaFileCsv } from "react-icons/fa";
import { useNavigate, BrowserRouter as Router } from "react-router-dom";

const EventsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Events');
  const [filterStatus, setFilterStatus] = useState('public'); 
  const [events, setEvents] = useState([]); 
  const [popupVisible, setPopupVisible] = useState(null);

  const handleTabClick = (tab) => setActiveTab(tab);
  const togglePopup = (id) => setPopupVisible(popupVisible === id ? null : id);
  const popupRef = useRef(null);
  useEffect(() => {
    
      fetchEventData();
   
  }, []);

  const fetchEventData = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/events/all`);
      if (!response.ok) {
        throw new Error('Failed to fetch event data');
      }
      const data = await response.json();
     
      setEvents(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error('Error fetching event data:', error);
      alert('Failed to load event data');
    }
  };
  const handleActionClick = (action, eventId) => {
    if (action === 'Edit') {
      // navigate(`/event/${eventId}`);
      navigate(`/event/detail/${eventId}`);
    }
    setPopupVisible(null);
    
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setPopupVisible(null);
      }
    };

    // Lắng nghe sự kiện click trên toàn document
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Cleanup sự kiện khi component unmount
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-[#202C4B]">Events</h1>
      <div className="flex items-center mt-6">
        <nav className="flex space-x-4">
          {['Events', 'Collections'].map((tab) => (
            <span
              key={tab}
              className={`cursor-pointer pb-1 ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600 font-bold'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </span>
          ))}
        </nav>
      </div>
      <div className="flex justify-between items-center mt-6 text-[13px]">
        <div className="relative">
          <input
            type="text"
            placeholder="Search events"
            className="w-[400px] border border-gray-300 rounded-md py-2 px-4"
          />
          <FaSearch className="absolute right-3 top-3 text-gray-400" />
        </div>
        <div className="flex space-x-4 mx-4">
          <select
            className="bg-gray-600 text-white py-2 px-4 rounded-md"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="public">Public</option>
            <option value="draft">Draft</option>
            <option value="complete">Complete</option>
          </select>
        </div>
        <div>
          <button
            className="ml-auto bg-orange-600 text-white py-2 px-4 rounded-md"
            onClick={() => navigate('/createEvent')}
          >
            Create Event
          </button>
        </div>
      </div>
      <div className="mt-6 bg-white rounded-md shadow text-[14px]">
        <div className="flex items-center p-4 border-b border-gray-200">
          <div className="w-1/2 text-gray-600">Event</div>
          <div className="w-1/6 text-gray-600">Sold</div>
          <div className="w-1/6 text-gray-600">Gross</div>
          <div className="w-1/6 text-gray-600">Status</div>
        </div>
        {events
          .filter((event) => event.eventStatus === filterStatus)
          .map((event) => (
            <div key={event.eventId} className="flex items-center p-4 relative hover:bg-gray-100">
              <div className="w-1/2 flex items-center space-x-4 text-[13px]">
                {/* Thay thế thời gian bằng ảnh đầu tiên từ eventImages */}
                {event.eventImages && event.eventImages.length > 0 ? (
                  <img
                    src={event.eventImages[0]}
                    alt={event.eventName}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
                <div>
                  <h3 className="text-[16px] font-semibold">{event.eventName}</h3>
                  <p className="text-gray-600">{event.eventLocation}</p>
                  <p className="text-gray-600">{event.eventType}</p>
                </div>
              </div>
              {/* Các trường sold và gross không có trong JSON mẫu, để tạm là 0 */}
              <div className="w-1/6 text-gray-600">0</div>
              <div className="w-1/6 text-gray-600">0</div>
              <div className="w-1/6 text-gray-600">{event.eventStatus}</div>
              <div className="ml-auto relative">
                <FaEllipsisV
                  className="text-gray-600 cursor-pointer"
                  onClick={() => togglePopup(event.eventId)}
                />
                {popupVisible === event.eventId && (
                  <div ref={popupRef} className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    {['Copy Event', 'Copy Link', 'Edit', 'Delete'].map((action) => (
                      <div
                        key={action}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleActionClick(action, event.eventId)}
                      >
                        {action}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
      <div className="mt-6">
        <a href="#" className="text-blue-600 flex items-center space-x-2">
          <FaFileCsv />
          <span>CSV Export</span>
        </a>
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div  className="">
      <EventsPage/>
    </div>
  );
};

export default Dashboard;
