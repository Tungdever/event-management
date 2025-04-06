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
  Navigate,
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
const MainLayout = () => {
  const { eventId } = useParams();
  const location = useLocation();

  // Các trang chỉ hiển thị nội dung (auth pages)
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
  ].includes(location.pathname) || location.pathname.startsWith("/event/");

  // Các trang chi tiết của event
  const isDetailOfEvent = [
    "/view",
    "/dashboard/refund",
    "/session",
    "/speaker",
    "/sponsor",
    "/task",
    "/addticket",
    "/member",
    "/editEvent",
    "/ticket",
    "/test",

  ].includes(location.pathname) || location.pathname.startsWith("/event/detail");

  // Các trang dashboard chung (không thuộc isFullScreenPageWithHeader, isAuthPage, hoặc isDetailOfEvent)
  const isDashboardPage = !isFullScreenPageWithHeader && !isAuthPage && !isDetailOfEvent;

  // Dữ liệu giả lập (thay bằng dữ liệu thực tế nếu cần)
  const ticketData = [];
  const notifications = [];
  const profileData = [{}];
  const employees = [];

  return (
    <div className="w-full min-h-screen bg-white">
      {/* 1. Các trang Auth không có Header hoặc Sidebar */}
      {isAuthPage && (
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot" element={<ForgotPassword />} />
        </Routes>
      )}

      {/* 2. Các trang Full Screen với Header */}
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
            </Routes>
          </div>
        </>
      )}

      {/* 3. Các trang Dashboard chung với Navbar và Sidebar2 */}
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
          </Routes>
        </div>
      )}

      {/* 4. Các trang chi tiết của event với Navbar và Sidebar */}
      {isDetailOfEvent && (
        <div className="w-full md:w-[calc(100%-256px)] md:ml-64 min-h-screen transition-all h-screen">
          <Navbar />
          <Sidebar id = {eventId} />
          <Routes>
            <Route path="/view" element={<ViewProfile infor={profileData[0]} />} />
            <Route path="/dashboard/refund" element={<RefundManagement />} />
            <Route path="/session" element={<Session />} />
            <Route path="/speaker" element={<Speaker />} />
            <Route path="/sponsor" element={<Sponsor />} />
            <Route path="/task" element={<TaskBoard />} />
            <Route path="/addticket" element={<AddTicket />} />
            <Route path="/member" element={<EmployeeList employees={employees} />} />
            <Route path="/ticket" element={<TicketDashboard />} />
             <Route path="/event/detail/:eventId" element={<EditEvent />} />
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