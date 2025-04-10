import "./App.css";
import EventPage from "./pages/Event/EventPage";
import EventDetail from "./pages/Event/EventDetailPage";
import HomePage from "./pages/Event/HomePage";
import SearchPage from "./pages/Event/Search";
import CalendarPage from "./pages/Dashboard/Calendar";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import TicketDashboard from "./pages/Ticket/TicketSold";
import ChatBox from "./pages/ChatBox/ChatBox";
import Dashboard from "./pages/Dashboard/Dashboard";
import Navbar from "./pages/Dashboard/Navbar";
import Sidebar from "./pages/Dashboard/Sidebar";
import EmployeeList from "./pages/Employee/EmployeeList";

import SignUp from "./pages/Auth/SignUp";
import LoginForm from "./pages/Auth/LogIn";
import NotificationList from "./pages/Dashboard/Notification";
import Checkout from "./pages/Checkout/checkout-page";
import Sponsor from "./pages/Sponsor/sponsor";
import Speaker from "./pages/Speaker/speaker";
import Session from "./pages/Session/session";
import AddTicket from "./pages/Ticket/AddTicket";
import ForgotPassword from "./pages/Auth/ForgotPass";
import CRUDEvent from "./pages/Event/CreateEventPage";
import TicketList from "./pages/Ticket/MyTicket";
import TaskBoard from "./pages/Employee/TaskDashboard";
import EventPublishing from "./pages/Event/EventPublishing";
import Refund from "./pages/Refund/refund";
import RefundManagement from "./pages/Refund/refund_management";
import ViewProfile from "./pages/Dashboard/ViewProfile";
import Sidebar2 from "./pages/Dashboard/Sidebar2";
import Header from "./components/Header";
import EditEvent from "./pages/Event/EditEventPage"
import { useParams } from "react-router-dom";
import EventGrid from "./pages/Event/PageViewAll";

const MainLayout = () => {
  const location = useLocation();
  const eventId = location.state?.eventId || undefined;
  const navigate = useNavigate();
  // Các trang auth
  const isAuthPage = ["/login", "/signup", "/forgot"].includes(location.pathname);

  // Các trang full screen với Header
  const isFullScreenPageWithHeader = [
    "/",
    "/search",
    "/checkout",
    "/myticket",
    "/refund",
    "/eventpage",
    "/createEvent",
    "/all-event",
  ].includes(location.pathname) || location.pathname.startsWith("/event/");

  // Các base path của trang chi tiết sự kiện (xóa "")
  const eventDetailBasePaths = [
    "/dashboard/view",
    "/dashboard/refund",
    "/dashboard/session",
    "/dashboard/speaker",
    "/dashboard/sponsor",
    "/dashboard/task",
    "/dashboard/addticket",
    "/dashboard/member",
    "/dashboard/editEvent",
    "/dashboard/ticket",
    "/dashboard/test",
  ];
  const handleEventClick = (eventId) => {
    console.log(`Clicked event with ID: ${eventId}`);
    //navigate(`/event/${eventId}`);
  };
  // Kiểm tra xem pathname có thuộc nhóm chi tiết sự kiện không
  const isDetailOfEvent = !isAuthPage && !isFullScreenPageWithHeader && eventDetailBasePaths.some((path) =>
    location.pathname.startsWith(path) || location.pathname.startsWith("/dashboard/event/detail")
  );

  // Các trang dashboard chung
  const isDashboardPage = !isFullScreenPageWithHeader && !isAuthPage && !isDetailOfEvent;

  // Dữ liệu giả lập
  const ticketData = [];
  const notifications = [];
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
  const employees = [];
  const eventsList =[
    {
      "eventId": 1,
      "eventName": "Hội thảo Công nghệ 2025",
      "eventDesc": "Cập nhật xu hướng công nghệ mới nhất",
      "eventType": "Conference",
      "eventHost": "TechCorp",
      "eventStatus": "public",
      "eventStart": "2025-05-01T09:00:00",
      "eventEnd": "2025-05-01T12:00:00",
      "eventLocation": "Hà Nội, Quận Hoàn Kiếm",
      "tags": "tech|innovation|AI|2025",
      "eventVisibility": "public",
      "publishTime": "now",
      "refunds": "yes",
      "validityDays": 7,
      "eventImages": [
        "http://res.cloudinary.com/dho1vjupv/image/upload/rhm2ntob1j5rrglwcxxa",
        "http://res.cloudinary.com/dho1vjupv/image/upload/wb3u4hpwkp79iprbhfqk"
      ],
      "textContent": "Công nghệ tương lai",
      "mediaContent": [
        "http://res.cloudinary.com/dho1vjupv/image/upload/ravqd0bgjw5itqrobylk"
      ]
    },
    {
      "eventId": 2,
      "eventName": "Triển lãm Nghệ thuật Hiện đại",
      "eventDesc": "Khám phá các tác phẩm nghệ thuật mới",
      "eventType": "Exhibition",
      "eventHost": "ArtGallery",
      "eventStatus": "private",
      "eventStart": "2025-05-03T14:00:00",
      "eventEnd": "2025-05-03T18:00:00",
      "eventLocation": "TP.HCM, Quận 1",
      "tags": "art|modern|exhibition",
      "eventVisibility": "private",
      "publishTime": "now",
      "refunds": "no",
      "validityDays": 5,
      "eventImages": [
        "http://res.cloudinary.com/dho1vjupv/image/upload/rhm2ntob1j5rrglwcxxa",
        "http://res.cloudinary.com/dho1vjupv/image/upload/wb3u4hpwkp79iprbhfqk"
      ],
      "textContent": "Nghệ thuật đương đại",
      "mediaContent": [
        "http://res.cloudinary.com/dho1vjupv/image/upload/ravqd0bgjw5itqrobylk"
      ]
    },
    {
      "eventId": 3,
      "eventName": "Lớp học Nấu ăn Cơ bản",
      "eventDesc": "Học nấu các món ăn truyền thống",
      "eventType": "Workshop",
      "eventHost": "CookingSchool",
      "eventStatus": "public",
      "eventStart": "2025-05-05T10:00:00",
      "eventEnd": "2025-05-05T13:00:00",
      "eventLocation": "Đà Nẵng, Quận Hải Châu",
      "tags": "cooking|food|workshop",
      "eventVisibility": "public",
      "publishTime": "now",
      "refunds": "yes",
      "validityDays": 10,
      "eventImages": [
        "http://res.cloudinary.com/dho1vjupv/image/upload/rhm2ntob1j5rrglwcxxa",
        "http://res.cloudinary.com/dho1vjupv/image/upload/wb3u4hpwkp79iprbhfqk"
      ],
      "textContent": "Ẩm thực Việt",
      "mediaContent": [
        "http://res.cloudinary.com/dho1vjupv/image/upload/ravqd0bgjw5itqrobylk"
      ]
    },
    {
      "eventId": 4,
      "eventName": "Hòa nhạc Giao hưởng",
      "eventDesc": "Trình diễn bởi dàn nhạc giao hưởng quốc gia",
      "eventType": "Concert",
      "eventHost": "MusicAcademy",
      "eventStatus": "public",
      "eventStart": "2025-05-07T19:00:00",
      "eventEnd": "2025-05-07T21:30:00",
      "eventLocation": "Hà Nội, Quận Ba Đình",
      "tags": "music|classical|concert",
      "eventVisibility": "public",
      "publishTime": "now",
      "refunds": "yes",
      "validityDays": 8,
      "eventImages": [
        "http://res.cloudinary.com/dho1vjupv/image/upload/rhm2ntob1j5rrglwcxxa",
        "http://res.cloudinary.com/dho1vjupv/image/upload/wb3u4hpwkp79iprbhfqk"
      ],
      "textContent": "Âm nhạc cổ điển",
      "mediaContent": [
        "http://res.cloudinary.com/dho1vjupv/image/upload/ravqd0bgjw5itqrobylk"
      ]
    },
    {
      "eventId": 5,
      "eventName": "Hội chợ Sách Quốc tế",
      "eventDesc": "Gặp gỡ các tác giả và nhà xuất bản",
      "eventType": "Fair",
      "eventHost": "BookClub",
      "eventStatus": "public",
      "eventStart": "2025-05-10T08:00:00",
      "eventEnd": "2025-05-10T17:00:00",
      "eventLocation": "TP.HCM, Quận 7",
      "tags": "books|literature|fair",
      "eventVisibility": "public",
      "publishTime": "now",
      "refunds": "no",
      "validityDays": 6,
      "eventImages": [
        "http://res.cloudinary.com/dho1vjupv/image/upload/rhm2ntob1j5rrglwcxxa",
        "http://res.cloudinary.com/dho1vjupv/image/upload/wb3u4hpwkp79iprbhfqk"
      ],
      "textContent": "Văn học thế giới",
      "mediaContent": [
        "http://res.cloudinary.com/dho1vjupv/image/upload/ravqd0bgjw5itqrobylk"
      ]
    },
    {
      "eventId": 6,
      "eventName": "Marathon Thành phố",
      "eventDesc": "Chạy bộ vì sức khỏe cộng đồng",
      "eventType": "Sports",
      "eventHost": "CityCouncil",
      "eventStatus": "public",
      "eventStart": "2025-05-12T06:00:00",
      "eventEnd": "2025-05-12T11:00:00",
      "eventLocation": "Hà Nội, Quận Tây Hồ",
      "tags": "sports|marathon|health",
      "eventVisibility": "public",
      "publishTime": "now",
      "refunds": "yes",
      "validityDays": 15,
      "eventImages": [
        "http://res.cloudinary.com/dho1vjupv/image/upload/rhm2ntob1j5rrglwcxxa",
        "http://res.cloudinary.com/dho1vjupv/image/upload/wb3u4hpwkp79iprbhfqk"
      ],
      "textContent": "Chạy vì cộng đồng",
      "mediaContent": [
        "http://res.cloudinary.com/dho1vjupv/image/upload/ravqd0bgjw5itqrobylk"
      ]
    },
    {
      "eventId": 7,
      "eventName": "Hội thảo Kinh doanh Online",
      "eventDesc": "Chiến lược kinh doanh thời 4.0",
      "eventType": "Seminar",
      "eventHost": "EcommerceVN",
      "eventStatus": "private",
      "eventStart": "2025-05-15T13:30:00",
      "eventEnd": "2025-05-15T16:30:00",
      "eventLocation": "TP.HCM, Quận Bình Thạnh",
      "tags": "business|ecommerce|online",
      "eventVisibility": "private",
      "publishTime": "now",
      "refunds": "yes",
      "validityDays": 7,
      "eventImages": [
        "http://res.cloudinary.com/dho1vjupv/image/upload/rhm2ntob1j5rrglwcxxa",
        "http://res.cloudinary.com/dho1vjupv/image/upload/wb3u4hpwkp79iprbhfqk"
      ],
      "textContent": "Kinh doanh số",
      "mediaContent": [
        "http://res.cloudinary.com/dho1vjupv/image/upload/ravqd0bgjw5itqrobylk"
      ]
    },
    {
      "eventId": 8,
      "eventName": "Lễ hội Ẩm thực",
      "eventDesc": "Thưởng thức đặc sản 3 miền",
      "eventType": "Festival",
      "eventHost": "FoodieVN",
      "eventStatus": "public",
      "eventStart": "2025-05-18T11:00:00",
      "eventEnd": "2025-05-18T20:00:00",
      "eventLocation": "Đà Nẵng, Quận Sơn Trà",
      "tags": "food|festival|culture",
      "eventVisibility": "public",
      "publishTime": "now",
      "refunds": "no",
      "validityDays": 3,
      "eventImages": [
        "http://res.cloudinary.com/dho1vjupv/image/upload/rhm2ntob1j5rrglwcxxa",
        "http://res.cloudinary.com/dho1vjupv/image/upload/wb3u4hpwkp79iprbhfqk"
      ],
      "textContent": "Ẩm thực Việt Nam",
      "mediaContent": [
        "http://res.cloudinary.com/dho1vjupv/image/upload/ravqd0bgjw5itqrobylk"
      ]
    },
    {
      "eventId": 9,
      "eventName": "Workshop Làm Gốm",
      "eventDesc": "Tự tay tạo sản phẩm gốm độc đáo",
      "eventType": "Workshop",
      "eventHost": "CraftStudio",
      "eventStatus": "public",
      "eventStart": "2025-05-20T14:00:00",
      "eventEnd": "2025-05-20T17:00:00",
      "eventLocation": "Hà Nội, Quận Cầu Giấy",
      "tags": "craft|pottery|workshop",
      "eventVisibility": "public",
      "publishTime": "now",
      "refunds": "yes",
      "validityDays": 5,
      "eventImages": [
        "http://res.cloudinary.com/dho1vjupv/image/upload/rhm2ntob1j5rrglwcxxa",
        "http://res.cloudinary.com/dho1vjupv/image/upload/wb3u4hpwkp79iprbhfqk"
      ],
      "textContent": "Nghệ thuật thủ công",
      "mediaContent": [
        "http://res.cloudinary.com/dho1vjupv/image/upload/ravqd0bgjw5itqrobylk"
      ]
    },
    {
      "eventId": 10,
      "eventName": "Hội nghị Y tế",
      "eventDesc": "Thảo luận về chăm sóc sức khỏe",
      "eventType": "Conference",
      "eventHost": "HealthOrg",
      "eventStatus": "private",
      "eventStart": "2025-05-22T09:30:00",
      "eventEnd": "2025-05-22T15:00:00",
      "eventLocation": "TP.HCM, Quận 3",
      "tags": "health|medical|conference",
      "eventVisibility": "private",
      "publishTime": "now",
      "refunds": "yes",
      "validityDays": 10,
      "eventImages": [
        "http://res.cloudinary.com/dho1vjupv/image/upload/rhm2ntob1j5rrglwcxxa",
        "http://res.cloudinary.com/dho1vjupv/image/upload/wb3u4hpwkp79iprbhfqk"
      ],
      "textContent": "Sức khỏe cộng đồng",
      "mediaContent": [
        "http://res.cloudinary.com/dho1vjupv/image/upload/ravqd0bgjw5itqrobylk"
      ]
    },
    {
      "eventId": 11,
      "eventName": "Ngày hội Gia đình",
      "eventDesc": "Các hoạt động vui chơi cho gia đình",
      "eventType": "Festival",
      "eventHost": "FamilyFun",
      "eventStatus": "public",
      "eventStart": "2025-05-25T10:00:00",
      "eventEnd": "2025-05-25T16:00:00",
      "eventLocation": "Hà Nội, Quận Long Biên",
      "tags": "family|fun|festival",
      "eventVisibility": "public",
      "publishTime": "now",
      "refunds": "no",
      "validityDays": 4,
      "eventImages": [
        "http://res.cloudinary.com/dho1vjupv/image/upload/rhm2ntob1j5rrglwcxxa",
        "http://res.cloudinary.com/dho1vjupv/image/upload/wb3u4hpwkp79iprbhfqk"
      ],
      "textContent": "Vui chơi gia đình",
      "mediaContent": [
        "http://res.cloudinary.com/dho1vjupv/image/upload/ravqd0bgjw5itqrobylk"
      ]
    },
    {
      "eventId": 12,
      "eventName": "Hội thảo Blockchain",
      "eventDesc": "Tìm hiểu công nghệ blockchain",
      "eventType": "Seminar",
      "eventHost": "CryptoVN",
      "eventStatus": "public",
      "eventStart": "2025-05-27T13:00:00",
      "eventEnd": "2025-05-27T16:00:00",
      "eventLocation": "TP.HCM, Quận Thủ Đức",
      "tags": "blockchain|crypto|tech",
      "eventVisibility": "public",
      "publishTime": "now",
      "refunds": "yes",
      "validityDays": 8,
      "eventImages": [
        "http://res.cloudinary.com/dho1vjupv/image/upload/rhm2ntob1j5rrglwcxxa",
        "http://res.cloudinary.com/dho1vjupv/image/upload/wb3u4hpwkp79iprbhfqk"
      ],
      "textContent": "Công nghệ tương lai",
      "mediaContent": [
        "http://res.cloudinary.com/dho1vjupv/image/upload/ravqd0bgjw5itqrobylk"
      ]
    },
    {
      "eventId": 13,
      "eventName": "Ngày hội Thể thao",
      "eventDesc": "Thi đấu các môn thể thao đồng đội",
      "eventType": "Sports",
      "eventHost": "SportClub",
      "eventStatus": "public",
      "eventStart": "2025-05-30T08:00:00",
      "eventEnd": "2025-05-30T14:00:00",
      "eventLocation": "Đà Nẵng, Quận Liên Chiểu",
      "tags": "sports|team|event",
      "eventVisibility": "public",
      "publishTime": "now",
      "refunds": "yes",
      "validityDays": 6,
      "eventImages": [
        "http://res.cloudinary.com/dho1vjupv/image/upload/rhm2ntob1j5rrglwcxxa",
        "http://res.cloudinary.com/dho1vjupv/image/upload/wb3u4hpwkp79iprbhfqk"
      ],
      "textContent": "Thể thao đồng đội",
      "mediaContent": [
        "http://res.cloudinary.com/dho1vjupv/image/upload/ravqd0bgjw5itqrobylk"
      ]
    },
    {
      "eventId": 14,
      "eventName": "Lớp học Yoga",
      "eventDesc": "Thư giãn và cải thiện sức khỏe",
      "eventType": "Workshop",
      "eventHost": "YogaCenter",
      "eventStatus": "public",
      "eventStart": "2025-06-01T07:00:00",
      "eventEnd": "2025-06-01T09:00:00",
      "eventLocation": "Hà Nội, Quận Hai Bà Trưng",
      "tags": "yoga|health|workshop",
      "eventVisibility": "public",
      "publishTime": "now",
      "refunds": "no",
      "validityDays": 5,
      "eventImages": [
        "http://res.cloudinary.com/dho1vjupv/image/upload/rhm2ntob1j5rrglwcxxa",
        "http://res.cloudinary.com/dho1vjupv/image/upload/wb3u4hpwkp79iprbhfqk"
      ],
      "textContent": "Sức khỏe tinh thần",
      "mediaContent": [
        "http://res.cloudinary.com/dho1vjupv/image/upload/ravqd0bgjw5itqrobylk"
      ]
    },
    {
      "eventId": 15,
      "eventName": "Hội thảo Du lịch",
      "eventDesc": "Khám phá các điểm đến mới",
      "eventType": "Seminar",
      "eventHost": "TravelAgency",
      "eventStatus": "public",
      "eventStart": "2025-06-03T15:00:00",
      "eventEnd": "2025-06-03T17:00:00",
      "eventLocation": "TP.HCM, Quận Phú Nhuận",
      "tags": "travel|tourism|seminar",
      "eventVisibility": "public",
      "publishTime": "now",
      "refunds": "yes",
      "validityDays": 7,
      "eventImages": [
        "http://res.cloudinary.com/dho1vjupv/image/upload/rhm2ntob1j5rrglwcxxa",
        "http://res.cloudinary.com/dho1vjupv/image/upload/wb3u4hpwkp79iprbhfqk"
      ],
      "textContent": "Du lịch Việt Nam",
      "mediaContent": [
        "http://res.cloudinary.com/dho1vjupv/image/upload/ravqd0bgjw5itqrobylk"
      ]
    },
    {
      "eventId": 16,
      "eventName": "Triển lãm Ô tô",
      "eventDesc": "Trưng bày các mẫu xe mới nhất",
      "eventType": "Exhibition",
      "eventHost": "AutoShow",
      "eventStatus": "public",
      "eventStart": "2025-06-05T10:00:00",
      "eventEnd": "2025-06-05T18:00:00",
      "eventLocation": "Hà Nội, Quận Nam Từ Liêm",
      "tags": "auto|exhibition|cars",
      "eventVisibility": "public",
      "publishTime": "now",
      "refunds": "no",
      "validityDays": 9,
      "eventImages": [
        "http://res.cloudinary.com/dho1vjupv/image/upload/rhm2ntob1j5rrglwcxxa",
        "http://res.cloudinary.com/dho1vjupv/image/upload/wb3u4hpwkp79iprbhfqk"
      ],
      "textContent": "Công nghệ ô tô",
      "mediaContent": [
        "http://res.cloudinary.com/dho1vjupv/image/upload/ravqd0bgjw5itqrobylk"
      ]
    }
  ]
  return (
    <div className="w-full min-h-screen bg-white">
      {/* 1. Auth Pages */}
      {isAuthPage && (
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot" element={<ForgotPassword />} />
        </Routes>
      )}

      {/* 2. Full Screen Pages with Header */}
      {isFullScreenPageWithHeader && (
        <>
          <Header />
          <div className="pt-16">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/event/:eventId" element={<EventDetail />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/myticket" element={<TicketList tickets={ticketData} />} />
              <Route path="/refund" element={<Refund />} />
              <Route path="/eventpage" element={<EventPage />} />
              <Route path="/createEvent" element={<CRUDEvent />} />
              <Route path="/all-event" element={<EventGrid events={eventsList} onEventClick={handleEventClick} />}/>
            </Routes>
          </div>
        </>
      )}

      {/* 3. Dashboard Pages */}
      {isDashboardPage && (
        <div className="w-full md:w-[calc(100%-256px)] md:ml-64 min-h-screen transition-all h-screen">
          <Navbar />
          <Sidebar2 />
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<ChatBox />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route
              path="/notification"
              element={<NotificationList notifications={notifications} />}
            />
            <Route path="/view" element={<ViewProfile infor={profileData[0]} />} />
          </Routes>
        </div>
      )}

      {/* 4. Event Detail Pages */}
      {isDetailOfEvent && (
        <div className="w-full md:w-[calc(100%-256px)] md:ml-64 min-h-screen transition-all h-screen">
          <Navbar />
          <Sidebar id={eventId} />
          <Routes>
            
            <Route path="/dashboard/view/:eventId" element={<ViewProfile infor={profileData[0]} />} />
            <Route path="/dashboard/refund" element={<RefundManagement />} />
            <Route path="/dashboard/refund/:eventId" element={<RefundManagement />} />
            <Route path="/dashboard/session" element={<Session />} />
            <Route path="/dashboard/session/:eventId" element={<Session />} />
            <Route path="/dashboard/speaker" element={<Speaker />} />
            <Route path="/dashboard/speaker/:eventId" element={<Speaker />} />
            <Route path="/dashboard/sponsor" element={<Sponsor />} />
            <Route path="/dashboard/sponsor/:eventId" element={<Sponsor />} />
            <Route path="/dashboard/task" element={<TaskBoard />} />
            <Route path="/dashboard/task/:eventId" element={<TaskBoard />} />
            <Route path="/dashboard/addticket" element={<AddTicket />} />
            <Route path="/dashboard/addticket/:eventId" element={<AddTicket />} />
            <Route path="/dashboard/member" element={<EmployeeList employees={employees} />} />
            <Route path="/dashboard/member/:eventId" element={<EmployeeList employees={employees} />} />
            <Route path="/dashboard/editEvent" element={<EditEvent />} />
            <Route path="/dashboard/editEvent/:eventId" element={<EditEvent />} />
            <Route path="/dashboard/ticket" element={<TicketDashboard />} />
            <Route path="/dashboard/ticket/:eventId" element={<TicketDashboard />} />
            <Route path="/dashboard/event/detail/:eventId" element={<EditEvent />} />
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