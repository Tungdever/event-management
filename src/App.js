
import './App.css';
import EventDetail from './pages/Event/Detail';
import HomePage from './pages/Event/HomePage';
import SearchPage from './pages/Event/Search';
import CalendarPage from './pages/Dashboard/Calendar';
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate,useLocation  } from 'react-router-dom';
import TicketDashboard from './pages/Ticket/TicketSold';
import ChatBox from './pages/ChatBox/ChatBox';
import Dashboard from './pages/Dashboard/Dashboard';
import Navbar from './pages/Dashboard/Navbar';
import Sidebar from './pages/Dashboard/Sidebar';
import EmployeeList from './pages/Employee/EmployeeList';
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
const employees = [
  {
    name: "John Michael",
    email: "john@company.com",
    role: "Manager",
    department: "Organization",
    status: "online",
    employedDate: "23/04/18",
    image: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg",
  },
  {
    name: "Sarah Smith",
    email: "sarah@company.com",
    role: "Designer",
    department: "Creative",
    status: "offline",
    employedDate: "12/07/19",
    image: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-2.jpg",
  },
];

const MainLayout = () => {
  const location = useLocation();
  const isFullScreenPage = location.pathname === "/" || location.pathname === "/detail" || location.pathname === "/search";

  return (
    <div className="w-full min-h-screen bg-while">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/detail" element={<EventDetail />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>

      {!isFullScreenPage && (
        <div className="w-full md:w-[calc(100%-256px)] md:ml-64 min-h-screen transition-all h-screen">
          <Navbar />
          <Sidebar />
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ticket" element={<TicketDashboard />} />
            <Route path="/chat" element={<ChatBox />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/member" element={<EmployeeList employees={employees} />} />
          </Routes>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
    <MainLayout />
  </Router>
  );
}

export default App;
