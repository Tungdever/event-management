
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ChatBox from "../ChatBox/ChatBox";
import CalendarPage from "./Calendar";
import HomePage from "../Event/HomePage";
import TicketDashboard from "../Ticket/TicketSold";
import EventDetail from "../Event/Detail";
import SearchPage from "../Event/Search";
const Content = () => {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
          <div className="flex justify-between mb-6">
            <div>
              <div className="flex items-center mb-1">
                <div className="text-2xl font-semibold">2</div>
              </div>
              <div className="text-sm font-medium text-gray-400">Users</div>
            </div>
            <div className="dropdown">
              <button
                type="button"
                className="dropdown-toggle text-gray-400 hover:text-gray-600"
              >
                <i className="ri-more-fill"></i>
              </button>
              <ul className="dropdown-menu shadow-md shadow-black/5 z-30 hidden py-1.5 rounded-md bg-white border border-gray-100 w-full max-w-[140px]">
                <li>
                  <a
                    href="#"
                    className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                  >
                    Profile
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                  >
                    Settings
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                  >
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <a
            href="/gebruikers"
            className="text-[#f84525] font-medium text-sm hover:text-red-800"
          >
            View
          </a>
        </div>
        <div className="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
          <div className="flex justify-between mb-4">
            <div>
              <div className="flex items-center mb-1">
                <div className="text-2xl font-semibold">100</div>
                <div className="p-1 rounded bg-emerald-500/10 text-emerald-500 text-[12px] font-semibold leading-none ml-2">
                  +30%
                </div>
              </div>
              <div className="text-sm font-medium text-gray-400">Companies</div>
            </div>
            <div className="dropdown">
              <button
                type="button"
                className="dropdown-toggle text-gray-400 hover:text-gray-600"
              >
                <i className="ri-more-fill"></i>
              </button>
              <ul className="dropdown-menu shadow-md shadow-black/5 z-30 hidden py-1.5 rounded-md bg-white border border-gray-100 w-full max-w-[140px]">
                <li>
                  <a
                    href="#"
                    className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                  >
                    Profile
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                  >
                    Settings
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                  >
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <a
            href="/dierenartsen"
            className="text-[#f84525] font-medium text-sm hover:text-red-800"
          >
            View
          </a>
        </div>
        <div className="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
          <div className="flex justify-between mb-6">
            <div>
              <div className="text-2xl font-semibold mb-1">100</div>
              <div className="text-sm font-medium text-gray-400">Blogs</div>
            </div>
            <div className="dropdown">
              <button
                type="button"
                className="dropdown-toggle text-gray-400 hover:text-gray-600"
              >
                <i className="ri-more-fill"></i>
              </button>
              <ul className="dropdown-menu shadow-md shadow-black/5 z-30 hidden py-1.5 rounded-md bg-white border border-gray-100 w-full max-w-[140px]">
                <li>
                  <a
                    href="#"
                    className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                  >
                    Profile
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                  >
                    Settings
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                  >
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <a
            href=""
            className="text-[#f84525] font-medium text-sm hover:text-red-800"
          >
            View
          </a>
        </div>
      </div>
      <Card/>
    </div>
  );
};
const Content2 = () => {
    const stats = [
      { count: 2, label: "Users" },
      { count: 100, label: "Companies", change: "+30%", changeClass: "text-green-500" },
      { count: 100, label: "Blogs" }
    ];
  
    const usersData = [
      { role: "Administrator", amount: 1, width: "70%", color: "bg-blue-500" },
      { role: "User", amount: 6, width: "40%", color: "bg-pink-500" },
      { role: "User", amount: 5, width: "45%", color: "bg-red-500" },
      { role: "User", amount: 4, width: "60%", color: "bg-green-500" }
    ];
  
    const activities = [
      { name: "Lorem Ipsum", date: "02-02-2024", time: "17.45" },
      { name: "Lorem Ipsum", date: "02-02-2024", time: "17.45" }
    ];
  
    const earnings = [
      { task: "Create landing page", amount: 235, type: "income" },
      { task: "Create landing page", amount: -235, type: "expense" }
    ];
  
    return (
      <div className="p-6">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
              <div className="flex justify-between mb-6">
                <div>
                  <div className="text-2xl font-bold text-gray-800">
                    {stat.count} {stat.change && <span className={stat.changeClass}>{stat.change}</span>}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
                <a className="text-blue-500" href="#">View</a>
              </div>
            </div>
          ))}
        </div>
  
        {/* Users Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-gray-800 font-bold mb-4">Users</div>
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="text-gray-600">ROLE</th>
                  <th className="text-gray-600">AMOUNT</th>
                  <th className="text-gray-600">%</th>
                </tr>
              </thead>
              <tbody>
                {usersData.map((user, index) => (
                  <tr key={index}>
                    <td className="py-2">{user.role}</td>
                    <td className="py-2">{user.amount}</td>
                    <td className="py-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className={`${user.color} h-2 rounded-full`} style={{ width: user.width }}></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
  
          {/* Activities List */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-gray-800 font-bold mb-4">Activities</div>
            <ul>
              {activities.map((activity, index) => (
                <li key={index} className="flex justify-between items-center py-2">
                  <div>{activity.name}</div>
                  <div className="text-gray-600">{activity.date}</div>
                  <div className="text-gray-600">{activity.time}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
  
        {/* Order Statistics & Earnings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-gray-800 font-bold mb-4">Order Statistics</div>
            <div className="flex justify-between items-center mb-4">
              <div className="text-gray-600">10 <span className="text-blue-500">Active</span></div>
              <div className="text-gray-600">50 <span className="text-green-500">Completed</span></div>
              <div className="text-gray-600">4 <span className="text-red-500">Canceled</span></div>
            </div>
            <img src="https://storage.googleapis.com/a1aa/image/mMrcgjqwvAx8ma_ySIcDeKdElrk9D_86J5P2ncBl9TU.jpg" alt="Graph showing order statistics over time" width="400" height="200" />
          </div>
  
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-gray-800 font-bold mb-4">Earnings</div>
            <ul>
              {earnings.map((earn, index) => (
                <li key={index} className="flex justify-between items-center py-2">
                  <div>{earn.task}</div>
                  <div className={earn.amount > 0 ? "text-green-500" : "text-red-500"}>${earn.amount}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };
const Card = () => {
  const users = [
    { role: "Administrator", amount: 1, progress: 70, color: "bg-blue-600" },
    { role: "User", amount: 6, progress: 40, color: "bg-blue-500" },
    { role: "User", amount: 5, progress: 45, color: "bg-pink-500" },
    { role: "User", amount: 4, progress: 60, color: "bg-red-500" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div className="p-6 relative flex flex-col bg-gray-50 dark:bg-gray-800 w-full shadow-lg rounded">
        <div className="rounded-t px-0 border-0">
          <div className="flex items-center px-4 py-2">
            <h3 className="font-semibold text-base text-gray-900 dark:text-gray-50">
              Users
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full bg-transparent border-collapse">
              <thead>
                <tr>
                  {["Role", "Amount", ""].map((header, index) => (
                    <th
                      key={index}
                      className="px-4 bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-100 py-3 text-xs uppercase font-semibold text-left"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index} className="text-gray-700 dark:text-gray-100">
                    <th className="border-t-0 px-4 align-middle text-xs p-4 text-left">
                      {user.role}
                    </th>
                    <td className="border-t-0 px-4 align-middle text-xs p-4">
                      {user.amount}
                    </td>
                    <td className="border-t-0 px-4 align-middle text-xs p-4">
                      <div className="flex items-center">
                        <span className="mr-2">{user.progress}%</span>
                        <div className="relative w-full">
                          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                            <div
                              style={{ width: `${user.progress}%` }}
                              className={`shadow-none flex flex-col text-center text-white justify-center ${user.color}`}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="bg-white border border-gray-100 shadow-md p-6 rounded-md">
        <div className="flex justify-between mb-4 items-start">
          <div className="font-medium">Activities</div>
          <div className="dropdown">
            <button className="text-gray-400 hover:text-gray-600">
              &#8942;
            </button>
          </div>
        </div>
        <div className="overflow-hidden">
          <table className="w-full min-w-[540px]">
            <tbody>
              {[1, 2, 3].map((_, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b border-gray-50">
                    <a
                      href="#"
                      className="text-gray-600 text-sm font-medium hover:text-blue-500"
                    >
                      Lorem Ipsum
                    </a>
                  </td>
                  <td className="py-2 px-4 border-b border-gray-50">
                    <span className="text-[13px] font-medium text-gray-400">
                      02-02-2024
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b border-gray-50">
                    <span className="text-[13px] font-medium text-gray-400">
                      17.45
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b border-gray-50">
                    <button className="text-gray-400 hover:text-gray-600">
                      &#8942;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
const eventData = {
  event_id: 1,
  event_desc: "Đêm nhạc Acoustic với các ca sĩ nổi tiếng",
  event_image: "https://cdn.evbstatic.com/s3-build/fe/build/images/08f04c907aeb48f79070fd4ca0a584f9-citybrowse_desktop.webp",
  event_name: "Acoustic Night 2025",
  event_desc:"In 2024, the global entertainment industry is projected to reach over $2.6 trillion, with a significant portion driven by film production and online content. The rise of advanced technologies like Artificial Intelligence (AI) and Augmented Reality (AR) has revolutionized production processes, enhancing creativity and efficiency. Notably, AI-powered tools for scriptwriting and post-production have become a new trend, shortening production cycles and increasing content originality.In Vietnam, the film industry is on a strong growth trajectory, bolstered by government support and the rising consumption of digital content. The expansion of local and international streaming platforms has stimulated the screenplay market. Vietnamese producers are actively seeking unique scripts that align with global trends and resonate with younger audiences, while fostering international collaborations to bring Vietnamese productions to global markets.Against this backdrop, TELEFILM VIETNAM 2025 serves as an ideal platform for businesses to enter and expand within the market. The exhibition showcases the latest technologies, from professional cameras to advanced post-production software. It also provides a forum for screenwriters, directors, and investors to meet, exchange ideas, and establish partnerships.",
  man_id: 101,
  mc_id: 202,
  event_type: "Concert",
  event_host: "Công ty Âm Nhạc XYZ",
  event_location: "Nhà hát Thành phố, TP.HCM",
  event_status: "Sắp diễn ra",
  event_start: "2025-03-15T19:00:00",
  event_end: "2025-03-15T22:00:00",
  listTickets: [
    { ticket_id: 1, event_id: 1, ticket_type: "VIP", price: 1200000, quantity: 50 },
    { ticket_id: 2, event_id: 1, ticket_type: "Standard", price: 600000, quantity: 200 },
    { ticket_id: 3, event_id: 1, ticket_type: "Student", price: 300000, quantity: 100 }
  ]
};

const Dashboard = () => {
  return (
    <div className="w-full md:w-[calc(100%-256px)] md:ml-64 bg-gray-200 min-h-screen transition-all main">
      <Navbar />

      <Sidebar />

     
      <Routes>

        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ticket" element={<TicketDashboard />} />
        <Route path="/chat" element={<ChatBox />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/detail" element={<EventDetail event={eventData} />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </div>
  );
};

export default Dashboard;
