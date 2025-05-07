import "./App.css";
import EventPage from "./pages/Event/EventPage";
import EventDetail from "./pages/Event/EventDetailPage";
import HomePage from "./pages/Event/HomePage";
import SearchPage from "./pages/Event/SearchPage";
import CalendarPage from "./pages/Dashboard/Calendar";
import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,

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
import Refund from "./pages/Refund/refund";
import RefundManagement from "./pages/Refund/refund_management";
import ViewProfile from "./pages/Dashboard/ViewProfile";
import Sidebar2 from "./pages/Dashboard/Sidebar2";
import Header from "./components/Header";
import EditEvent from "./pages/Event/EditEventPage"
import EventGrid from "./pages/Event/PageViewAll";
import SearchByType from "./pages/Event/SearchPageByType";
import { AuthProvider } from "./pages/Auth/AuthProvider";
import DashboardPage from "./pages/AdminBoard/DashboardPage";
import ReportPage from "./pages/AdminBoard/ReportPage";
import UserPage from "./pages/AdminBoard/UserPage";
import RolePage from "./pages/AdminBoard/RolePage";
import SidebarAdminBoard from "./pages/AdminBoard/Sidebar";
import PaymentResult from "./pages/Checkout/PaymentResult"
import MyBooking from "./pages/Booking/MyBooking";
import ReportOrder from "./pages/report/order"
import ViewTicket from "./pages/Ticket/ViewTicket"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const MainLayout = () => {
  const location = useLocation();
  const eventId = location.state?.eventId || undefined;

  // Các trang auth
  const isAuthPage = ["/login", "/signup", "/forgot"].includes(location.pathname);

  // Các trang full screen với Header
  const isFullScreenPageWithHeader = [
    "/",
    "/search",
    "/checkout",
    "/myticket",
    "/refund",
    "/event-like",
    "/createEvent",
    "/all-event",
    "/payment-result",
    "/my-bookings"
  ].includes(location.pathname) || location.pathname.startsWith("/event/") || location.pathname.startsWith("/list-event-search-by") || location.pathname.startsWith("/view-tickets");

  // Các base path của trang chi tiết sự kiện
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
    "/dashboard/order"
  ];
  const handleEventClick = (eventId) => {
    console.log(`Clicked event with ID: ${eventId}`);
    //navigate(`/event/${eventId}`);
  };
  // Kiểm tra xem pathname có thuộc nhóm chi tiết sự kiện không
  const isDetailOfEvent = !isAuthPage && !isFullScreenPageWithHeader && eventDetailBasePaths.some((path) =>
    location.pathname.startsWith(path) || location.pathname.startsWith("/dashboard/event/detail")
  );
  // Các trang admin
  const isAdminPage = location.pathname.startsWith("/admin");
  // Các trang dashboard chung
  const isDashboardPage =
    !isFullScreenPageWithHeader && !isAuthPage && !isDetailOfEvent && !isAdminPage;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


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
              <Route path="/myticket" element={<TicketList />} />
              <Route path="/refund" element={<Refund />} />
              <Route path="/event-like" element={<EventPage />} />
              <Route path="/createEvent" element={<CRUDEvent />} />
              <Route path="/all-event" element={<EventGrid onEventClick={handleEventClick} />} />
              <Route path="/list-event-search-by/:categoryName" element={<SearchByType />} />
              <Route path="/payment-result" element={<PaymentResult />} />
              <Route path="/my-bookings" element={<MyBooking />} />
              <Route path="/view-tickets/:orderCode" element={<ViewTicket />} />
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
              element={<NotificationList />}
            />
            <Route path="/view" element={<ViewProfile />} />
          </Routes>
        </div>
      )}

      {/* 4. Event Detail Pages */}
      {isDetailOfEvent && (
        <div className="w-full md:w-[calc(100%-256px)] md:ml-64 min-h-screen transition-all h-screen">
          <Navbar />
          <Sidebar id={eventId} />
          <Routes>
            <Route path="/dashboard/view/:eventId" element={<ViewProfile />} />
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
            <Route path="/dashboard/member" element={<EmployeeList />} />
            <Route path="/dashboard/member/:eventId" element={<EmployeeList />} />
            <Route path="/dashboard/editEvent" element={<EditEvent />} />
            <Route path="/dashboard/editEvent/:eventId" element={<EditEvent />} />
            <Route path="/dashboard/ticket" element={<TicketDashboard />} />
            <Route path="/dashboard/order" element={<ReportOrder />} />
            <Route path="/dashboard/ticket/:eventId" element={<TicketDashboard />} />
            <Route path="/dashboard/event/detail/:eventId" element={<EditEvent />} />
          </Routes>
        </div>
      )}
      {/* 5. Admin Pages */}
      {isAdminPage && (
        <div className="flex">
          <SidebarAdminBoard isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <div className="flex-1 flex flex-col">
            <Navbar />
            <Routes>
              <Route path="/admin" element={<DashboardPage />} />
              <Route path="/admin/report" element={<ReportPage />} />
              <Route path="/admin/user" element={<UserPage />} />
              <Route path="/admin/role" element={<RolePage />} />
            </Routes>
          </div>
        </div>

      )}
    </div>
  );
};
function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastContainer />
        <MainLayout />
      </AuthProvider>
    </Router>
  );
}

export default App;