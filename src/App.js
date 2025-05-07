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
import EditEvent from "./pages/Event/EditEventPage";
import AllEvent from "./pages/Event/PageViewAll";
import SearchByType from "./pages/Event/SearchPageByType";
import { AuthProvider } from "./pages/Auth/AuthProvider";
import DashboardPage from "./pages/AdminBoard/DashboardPage";
import ReportPage from "./pages/AdminBoard/ReportPage";
import UserPage from "./pages/AdminBoard/UserPage";
import RolePage from "./pages/AdminBoard/RolePage";
import SidebarAdminBoard from "./pages/AdminBoard/Sidebar";
import { WebSocketProvider } from "./pages/ChatBox/WebSocketContext";
import { useAuth } from "./pages/Auth/AuthProvider";
import EventSignup from "./pages/Auth/EventSignUp";
import RoleBasedRouteGroup from "./pages/Auth/ProtectedRoute";
import ChatBubble from "./pages/ChatBox/ChatBubble";

import PaymentResult from "./pages/Checkout/PaymentResult"
import MyBooking from "./pages/Booking/MyBooking";
import ReportOrder from "./pages/report/order"
import ViewTicket from "./pages/Ticket/ViewTicket"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const MainLayout = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Mặc định mở sidebar

  const eventId = location.state?.eventId || undefined;
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isAuthPage = ["/login", "/signup", "/forgot", "/event-signup"].includes(
    location.pathname
  );

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
    "/notification"
  ].includes(location.pathname) || location.pathname.startsWith("/event/") || location.pathname.startsWith("/list-event-search-by") || location.pathname.startsWith("/view-tickets");

  const isDashboardPage = [
    "/dashboard",
    "/chat",
    "/chat2",
    "/calendar",
    "/notification",
    "/view",
  ].includes(location.pathname);

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
    "/dashboard/event/detail",
    "/dashboard/order"
    "/dashboard/test",
  ];
  const isDetailOfEvent = eventDetailBasePaths.some((path) =>
    location.pathname.startsWith(path)
  );

  const isAdminPage = location.pathname.startsWith("/admin");

  const handleEventClick = (eventId) => {
    console.log(`Clicked event with ID: ${eventId}`);
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

  return (
    <WebSocketProvider>
      <div className="w-full min-h-screen bg-white">
        {isAuthPage && (
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route path="/event-signup" element={<EventSignup />} />

          </Routes>
        )}

        {isFullScreenPageWithHeader && !isAuthPage && (
          <>
            <Header />
            <div className="pt-16">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/event/:eventId" element={<EventDetail />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/all-event" element={<AllEvent onEventClick={handleEventClick} />} />
                <Route path="/list-event-search-by/:categoryName" element={<SearchByType />} />
                <Route
                  path="/checkout"
                  element={
                    <RoleBasedRouteGroup allowedRoles={["ATTENDEE", "ORGANIZER"]}>
                      <Checkout />
                    </RoleBasedRouteGroup>
                  }
                />
                <Route
                  path="/myticket"
                  element={
                    <RoleBasedRouteGroup allowedRoles={["ATTENDEE", "ORGANIZER"]}>
                      <TicketList />
                    </RoleBasedRouteGroup>
                  }
                />
                <Route
                  path="/refund"
                  element={
                    <RoleBasedRouteGroup allowedRoles={["ATTENDEE", "ORGANIZER"]}>
                      <Refund />
                    </RoleBasedRouteGroup>
                  }
                />
                <Route
                  path="/event-like"
                  element={
                    <RoleBasedRouteGroup allowedRoles={["ATTENDEE", "ORGANIZER"]}>
                      <EventPage />
                    </RoleBasedRouteGroup>
                  }
                />
                <Route
                  path="/createEvent"
                  element={
                    <RoleBasedRouteGroup allowedRoles={["ORGANIZER"]}>
                      <CRUDEvent />
                    </RoleBasedRouteGroup>
                  }
                />
                <Route
                path="/notification"
                element={
                  <RoleBasedRouteGroup allowedRoles={["ORGANIZER", "ATTENDEE"]}>
                    <NotificationList />
                  </RoleBasedRouteGroup>
                }
              />
              </Routes>
            </div>
          </>
        )}

        {isDashboardPage && !isAuthPage && !isFullScreenPageWithHeader && !isAdminPage && (
          <div className="flex flex-col md:flex-row min-h-screen">
          <Sidebar2 isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <div className="w-full md:w-[calc(100%-224px)] lg:w-[calc(100%-256px)] md:ml-56 lg:ml-64 min-h-screen transition-all">
            <Navbar toggleSidebar={toggleSidebar} />
            <Routes>
              <Route
                path="/dashboard"
                element={
                  <RoleBasedRouteGroup allowedRoles={["ORGANIZER", "ATTENDEE"]}>
                    <Dashboard />
                  </RoleBasedRouteGroup>
                }
              />
              <Route
                path="/chat"
                element={
                  <RoleBasedRouteGroup allowedRoles={["ORGANIZER", "ATTENDEE"]}>
                    <ChatBox />
                  </RoleBasedRouteGroup>
                }
              />
              
              <Route
                path="/calendar"
                element={
                  <RoleBasedRouteGroup allowedRoles={["ORGANIZER", "ATTENDEE"]}>
                    <CalendarPage />
                  </RoleBasedRouteGroup>
                }
              />
              {/* <Route
                path="/notification"
                element={
                  <RoleBasedRouteGroup allowedRoles={["ORGANIZER", "ATTENDEE"]}>
                    <NotificationList />
                  </RoleBasedRouteGroup>
                }
              /> */}
              <Route
                path="/view"
                element={
                  <RoleBasedRouteGroup allowedRoles={["ORGANIZER", "ATTENDEE"]}>
                    <ViewProfile />
                  </RoleBasedRouteGroup>
                }
              />
            </Routes>
          </div>
        </div>
        )}

        {isDetailOfEvent && !isAuthPage && !isFullScreenPageWithHeader && !isAdminPage && (
          <div className="w-full md:w-[calc(100%-256px)] md:ml-64 min-h-screen transition-all">
            <Navbar />
            <Sidebar id={eventId} />
            <Routes>
              <Route
                path="/dashboard/view/:eventId"
                element={
                  <RoleBasedRouteGroup allowedRoles={["ORGANIZER"]}>
                    <ViewProfile />
                  </RoleBasedRouteGroup>
                }
              />
              <Route
                path="/dashboard/refund/:eventId"
                element={
                  <RoleBasedRouteGroup allowedRoles={["ORGANIZER"]}>
                    <RefundManagement />
                  </RoleBasedRouteGroup>
                }
              />
              <Route
                path="/dashboard/session/:eventId"
                element={
                  <RoleBasedRouteGroup allowedRoles={["ORGANIZER"]}>
                    <Session />
                  </RoleBasedRouteGroup>
                }
              />
              <Route
                path="/dashboard/speaker/:eventId"
                element={
                  <RoleBasedRouteGroup allowedRoles={["ORGANIZER"]}>
                    <Speaker />
                  </RoleBasedRouteGroup>
                }
              />
              <Route
                path="/dashboard/sponsor/:eventId"
                element={
                  <RoleBasedRouteGroup allowedRoles={["ORGANIZER"]}>
                    <Sponsor />
                  </RoleBasedRouteGroup>
                }
              />
              <Route
                path="/dashboard/task/:eventId"
                element={
                  <RoleBasedRouteGroup allowedRoles={["ORGANIZER"]}>
                    <TaskBoard />
                  </RoleBasedRouteGroup>
                }
              />
              <Route
                path="/dashboard/addticket/:eventId"
                element={
                  <RoleBasedRouteGroup allowedRoles={["ORGANIZER"]}>
                    <AddTicket />
                  </RoleBasedRouteGroup>
                }
              />
              <Route
                path="/dashboard/member/:eventId"
                element={
                  <RoleBasedRouteGroup allowedRoles={["ORGANIZER"]}>
                    <EmployeeList />
                  </RoleBasedRouteGroup>
                }
              />
              <Route
                path="/dashboard/editEvent/:eventId"
                element={
                  <RoleBasedRouteGroup allowedRoles={["ORGANIZER"]}>
                    <EditEvent />
                  </RoleBasedRouteGroup>
                }
              />
              <Route
                path="/dashboard/ticket/:eventId"
                element={
                  <RoleBasedRouteGroup allowedRoles={["ORGANIZER"]}>
                    <TicketDashboard />
                  </RoleBasedRouteGroup>
                }
              />
              <Route
                path="/dashboard/event/detail/:eventId"
                element={
                  <RoleBasedRouteGroup allowedRoles={["ORGANIZER"]}>
                    <EditEvent />
                  </RoleBasedRouteGroup>
                }
              />
            </Routes>
          </div>
        )}

        {isAdminPage && !isAuthPage && (
          <div className="relative min-h-screen">
            <SidebarAdminBoard
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
            />
            <div className="flex-1 flex flex-col lg:ml-64">
              <Navbar />
              <main className="flex-1 overflow-y-auto">
                <Routes>
                  <Route
                    path="/admin"
                    element={
                      <RoleBasedRouteGroup allowedRoles={["ADMIN"]}>
                        <DashboardPage />
                      </RoleBasedRouteGroup>
                    }
                  />
                  <Route
                    path="/admin/report"
                    element={
                      <RoleBasedRouteGroup allowedRoles={["ADMIN"]}>
                        <ReportPage />
                      </RoleBasedRouteGroup>
                    }
                  />
                  <Route
                    path="/admin/user"
                    element={
                      <RoleBasedRouteGroup allowedRoles={["ADMIN"]}>
                        <UserPage />
                      </RoleBasedRouteGroup>
                    }
                  />
                  <Route
                    path="/admin/role"
                    element={
                      <RoleBasedRouteGroup allowedRoles={["ADMIN"]}>
                        <RolePage />
                      </RoleBasedRouteGroup>
                    }
                  />
                </Routes>
              </main>
            </div>
          </div>
        )}

        {user && !isAuthPage && !isDashboardPage && !isAdminPage && <ChatBubble currentUser={user} />}
      </div>
    </WebSocketProvider>
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