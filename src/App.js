import './App.css';
import EventPage from './pages/Event/EventPage';
import EventDetail from './pages/Event/Detail';
import HomePage from './pages/Event/HomePage';
import SearchPage from './pages/Event/Search';
import CalendarPage from './pages/Dashboard/Calendar';
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import TicketDashboard from './pages/Ticket/TicketSold';
import ChatBox from './pages/ChatBox/ChatBox';
import Dashboard from './pages/Dashboard/Dashboard';
import Navbar from './pages/Dashboard/Navbar';
import Sidebar from './pages/Dashboard/Sidebar';
import EmployeeList from './pages/Employee/EmployeeList';
import EditEvent from './pages/Event/EditEvent';
import SignUp from './pages/Auth/SignUp';
import LoginForm from './pages/Auth/LogIn';
import NotificationList from './pages/Dashboard/Notification';
import Checkout from "./pages/Checkout/checkout-page";
import Sponsor from "./pages/Sponsor/sponsor";
import Speaker from "./pages/Speaker/speaker"
import Session from "./pages/Session/session"
import AddTicket from './pages/Ticket/AddTicket';
import ForgotPassword from './pages/Auth/ForgotPass';
import CRUDEvent from './pages/Event/FullPageCRUDEvent';
import TicketList from './pages/Ticket/MyTicket';
import TaskBoard from './pages/Employee/TaskDashboard';
import EventPublishing from './pages/Event/EventPublishing';
import Refund from './pages/Refund/refund'
import RefundManagement from './pages/Refund/refund_management'
import ViewProfile from './pages/Dashboard/ViewProfile';
import Chat from './pages/ChatBox/ChatSocket';

const eventData = {
  event_id: 1,
  event_desc: "Đêm nhạc Acoustic với các ca sĩ nổi tiếng",
  event_image: "https://cdn.evbstatic.com/s3-build/fe/build/images/08f04c907aeb48f79070fd4ca0a584f9-citybrowse_desktop.webp",
  event_name: "Acoustic Night 2025",
  event_desc: "In 2024, the global entertainment industry is projected to reach over $2.6 trillion, with a significant portion driven by film production and online content. The rise of advanced technologies like Artificial Intelligence (AI) and Augmented Reality (AR) has revolutionized production processes, enhancing creativity and efficiency. Notably, AI-powered tools for scriptwriting and post-production have become a new trend, shortening production cycles and increasing content originality.In Vietnam, the film industry is on a strong growth trajectory, bolstered by government support and the rising consumption of digital content. The expansion of local and international streaming platforms has stimulated the screenplay market. Vietnamese producers are actively seeking unique scripts that align with global trends and resonate with younger audiences, while fostering international collaborations to bring Vietnamese productions to global markets.Against this backdrop, TELEFILM VIETNAM 2025 serves as an ideal platform for businesses to enter and expand within the market. The exhibition showcases the latest technologies, from professional cameras to advanced post-production software. It also provides a forum for screenwriters, directors, and investors to meet, exchange ideas, and establish partnerships.",
  man_id: 101,
  mc_id: 202,
  event_type: "Concert",
  event_host: "Công ty Âm Nhạc XYZ",
  event_location: "Sheraton Hanoi Hotel 11 Đường Xuân Diệu Hanoi, Hà Nội ",
  event_status: "Sắp diễn ra",
  event_start: "2025-03-15T19:00:00",
  event_end: "2025-03-15T22:00:00",
 
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
const notifications = [
  {
    id: 1,
    name: "Trần Minh Khôi",
    message: "đã mời bạn tham gia sự kiện 'Hội Thảo Công Nghệ 4.0'.",
    time: "2 giờ trước",
    mutualFriends: "5 người bạn cũng tham gia.",
    image: "https://storage.googleapis.com/a1aa/image/RO9a_Km3MzmI6eXhXAX_iepBq_xtGzHYV9VobLWk4Bg.jpg",
    hasActions: true,
  },
  {
    id: 2,
    name: "Nguyễn Hoàng Anh",
    message: "đã xác nhận tham dự sự kiện 'Diễn Đàn Khởi Nghiệp 2025'.",
    time: "5 giờ trước",
    image: "https://storage.googleapis.com/a1aa/image/zikBlWLojSoSRz55uD4rJDkt03syxPihqxo11KJOrzc.jpg",
    hasActions: false,
  },
  {
    id: 3,
    name: "Hệ thống",
    message: "Sự kiện 'Hội Nghị Trí Tuệ Nhân Tạo' sẽ diễn ra vào ngày mai. Hãy đảm bảo bạn đã đăng ký tham dự.",
    time: "Hôm qua",
    image: "https://storage.googleapis.com/a1aa/image/VFzmkOIbebjne3na3F1tAR2DJWjNF1drwnptDa7QyLc.jpg",
    hasActions: false,
  },
  {
    id: 4,
    name: "Lê Thanh Huy",
    message: "đã gửi cho bạn lời mời làm diễn giả tại sự kiện 'Xu Hướng Công Nghệ Tương Lai'.",
    time: "2 ngày trước",
    mutualFriends: "3 diễn giả khác cũng tham gia.",
    image: "https://storage.googleapis.com/a1aa/image/vQRA-hLZMfFnSRwIJxjyrqnfSO2-Zeuv5EobX8PifwA.jpg",
    hasActions: true,
  },
  {
    id: 5,
    name: "Ban Tổ Chức",
    message: "Vé tham dự sự kiện 'Hội Thảo Lãnh Đạo Trẻ' của bạn đã được xác nhận.",
    time: "3 ngày trước",
    image: "https://storage.googleapis.com/a1aa/image/RO9a_Km3MzmI6eXhXAX_iepBq_xtGzHYV9VobLWk4Bg.jpg",
    hasActions: false,
  },
  {
    id: 6,
    name: "Trần Quang Dũng",
    message: "đã gửi cho bạn lời mời kết nối để cùng tham gia 'Hội Thảo Kinh Tế Toàn Cầu'.",
    time: "4 ngày trước",
    mutualFriends: "2 người bạn chung.",
    image: "https://storage.googleapis.com/a1aa/image/zikBlWLojSoSRz55uD4rJDkt03syxPihqxo11KJOrzc.jpg",
    hasActions: true,
  },
  {
    id: 7,
    name: "Hệ thống",
    message: "Bạn đã được thêm vào danh sách khách mời của sự kiện 'Hội Nghị Blockchain 2025'.",
    time: "5 ngày trước",
    image: "https://storage.googleapis.com/a1aa/image/VFzmkOIbebjne3na3F1tAR2DJWjNF1drwnptDa7QyLc.jpg",
    hasActions: false,
  },
  {
    id: 8,
    name: "Nguyễn Phương Thảo",
    message: "đã bình luận về bài đăng của bạn trong sự kiện 'Tọa Đàm Đổi Mới Sáng Tạo'.",
    time: "6 ngày trước",
    image: "https://storage.googleapis.com/a1aa/image/vQRA-hLZMfFnSRwIJxjyrqnfSO2-Zeuv5EobX8PifwA.jpg",
    hasActions: false,
  },
];
const ticketData = [
  {
    id: "A1B2C3",
    ticketName: "Music Festival 2025",
    eventDate: "April 20, 2025",
    eventTime: "18:00 - 23:00",
    location: "Central Park, New York",
    seat: "VIP Zone - A12",
    price: "$50.00",
    image: "https://i.pinimg.com/474x/c9/fc/5b/c9fc5b906a994962bbc5d530e1cb9ce6.jpg",
  },
  {
    id: "D4E5F6",
    ticketName: "Tech Conference",
    eventDate: "May 15, 2025",
    eventTime: "09:00 - 17:00",
    location: "Silicon Valley Convention Center",
    seat: "Hall B - Row 5, Seat 23",
    price: "$120.00",
    image: "https://i.pinimg.com/474x/20/12/68/201268d8c3f9c7f98521b949b8671b92.jpg",
  },
  {
    id: "G7H8I9",
    ticketName: "Art Exhibition",
    eventDate: "June 10, 2025",
    eventTime: "10:00 - 20:00",
    location: "Louvre Museum, Paris",
    seat: "General Admission",
    price: "$30.00",
    image: "https://i.pinimg.com/474x/92/18/4a/92184a471672bcd65d46557674d14206.jpg",
  },
];

const profileData = [
  {
    fullName: "Michael Johnson",
    title: "Event Organizer & Planner",
    desc: "Experienced event planner specializing in corporate events, conferences, and social gatherings. Passionate about creating seamless and memorable experiences.",
    firstName: "Michael",
    lastName: "Johnson",
    birthday: "1985-06-15",
    gender: "Male",
    email: "michael.johnson@example.com",
    phone: "+1 555-123-4567",
    permanentAddress: "123 Main Street, New York, NY, USA",
    country: "USA",
    state: "New York",
    currentAddress: "456 Elm Street, Brooklyn, NY, USA",
    organizer: "Founder & CEO of MJ Event Management",
    education: "Bachelor's Degree in Event Management, University of California",
  }
];
const MainLayout = () => {
  const location = useLocation();
  const isFullScreenPage = location.pathname === "/" 
  || location.pathname === "/detail" || location.pathname === "/search"|| location.pathname === "/test"
  || location.pathname === "/login" || location.pathname === "/signup"
  || location.pathname === "/addTicket" || location.pathname === "/checkout"
   || location.pathname === "/refund" || location.pathname === "/eventpage";

  return (
    <div className="w-full min-h-screen bg-while">
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/detail" element={<EventDetail eventId={1} />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path ="/forgot" element={<ForgotPassword/>} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path ="/myticket" element={<TicketList tickets={ticketData}/>}></Route>
        <Route path ="/refund" element={<Refund />}></Route>
        <Route path ="/eventpage" element={<EventPage />}></Route>
        <Route path="/test" element={<Chat/>}/>
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
            <Route path="/createEvent" element={<CRUDEvent />} />
            <Route path="/editEvent" element={<EditEvent />} />
            <Route path="/publicEvent" element={<EventPublishing eventData={eventData}/>} />
            <Route path="/member" element={<EmployeeList employees={employees} />} />
            <Route path="/notification" element={<NotificationList notifications={notifications} />} />       
            <Route path ="/addticket" element={<AddTicket/>}>  </Route>
            <Route path="/task" element={<TaskBoard />} />
            <Route path="/crudEvent" element={<CRUDEvent/>}></Route>
            <Route path="/sponsor" element={<Sponsor />} />
            <Route path="/speaker" element={<Speaker />} />
            <Route path="/session" element={<Session />} />
            <Route path="/dashboard/refund" element={<RefundManagement />} />
            <Route path="/view" element={<ViewProfile infor={profileData[0]}/>} />
          
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
