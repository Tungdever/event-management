
import React, { useState } from "react";
import { FaSearch, FaList, FaCalendarAlt, FaEllipsisV, FaFileCsv } from "react-icons/fa";
import { useNavigate, BrowserRouter as Router } from "react-router-dom";

const EventsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Events");
  const [filterStatus, setFilterStatus] = useState("Draft");
  const [events] = useState([
    {
      id: 1,
      date: "APR 16",
      title: "Mental Health First Aid (MHFA) Training",
      location: "Online event",
      time: "Wednesday, April 16, 2025 at 10:00 AM +07",
      sold: "0 / 0",
      gross: "$0.00",
      status: "Draft",
    },
    {
      id: 22,
      date: "APR 16",
      title: "Mental Health First Aid (MHFA) Training",
      location: "Online event",
      time: "Wednesday, April 16, 2025 at 10:00 AM +07",
      sold: "0 / 0",
      gross: "$0.00",
      status: "Public",
    },
  ]);
  const [popupVisible, setPopupVisible] = useState(null);

  const handleTabClick = (tab) => setActiveTab(tab);
  const togglePopup = (id) => setPopupVisible(popupVisible === id ? null : id);

  return (
   
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold text-purple-900">Events</h1>
        <div className="flex items-center mt-6">
          <nav className="flex space-x-4">
            {["Events", "Collections"].map((tab) => (
              <span
                key={tab}
                className={`cursor-pointer pb-1 ${activeTab === tab ? "text-blue-600 border-b-2 border-blue-600 font-bold" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => handleTabClick(tab)}
              >
                {tab}
              </span>
            ))}
          </nav>
        </div>
        <div className="flex justify-between items-center  mt-6  text-[13px]">
          <div className="relative ">
            <input type="text" placeholder="Search events" className="w-[400px] border border-gray-300 rounded-md py-2 px-4" />
            <FaSearch className="absolute right-3 top-3 text-gray-400" />
          </div>
          <div className="flex space-x-4 mx-4">
            <button className="flex items-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-md">
              <FaList />
              <span>List</span>
            </button>
            <button className="flex items-center space-x-2 border border-gray-300 py-2 px-4 rounded-md">
              <FaCalendarAlt />
              <span>Calendar</span>
            </button>
            <select className="bg-blue-600 text-white py-2 px-4 rounded-md" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="Draft">Draft</option>
              <option value="Public">Public</option>
              <option value="Complete">Complete</option>
            </select>
          </div>
          <div>
          <button className="ml-auto bg-red-600 text-white py-2 px-4 rounded-md" onClick={() => navigate("/create-event")}>
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
          {events.filter((event) => event.status === filterStatus).map((event) => (
            <div key={event.id} className="flex items-center p-4 relative ">
              <div className="w-1/2 flex items-center space-x-4 text-[13px]">
                <div className="text-center ">
                  <div className="text-red-600 font-bold">{event.date.split(" ")[0]}</div>
                  <div className="text-xl font-bold">{event.date.split(" ")[1]}</div>
                </div>
                <div>
                  <h3 className="text-[16px] font-semibold">{event.title}</h3>
                  <p className="text-gray-600">{event.location}</p>
                  <p className="text-gray-600">{event.time}</p>
                </div>
              </div>
              <div className="w-1/6 text-gray-600">{event.sold}</div>
              <div className="w-1/6 text-gray-600">{event.gross}</div>
              <div className="w-1/6 text-gray-600">{event.status}</div>
              <div className="ml-auto relative">
                <FaEllipsisV className="text-gray-600 cursor-pointer" onClick={() => togglePopup(event.id)} />
                {popupVisible === event.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    {["Copy Event", "Copy Link", "Edit", "Delete"].map((action) => (
                      <div key={action} className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
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
    <div>
      <EventsPage/>
    </div>
  );
};

export default Dashboard;
