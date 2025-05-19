import React, { useState, useEffect } from "react";
import Sidebar from "./MainSidebar";
import Navbar from "../Dashboard/Navbar";
import Dashboard from "./Dashboard";
import Calendar from "./Calendar";
import ChatBox from "../ChatBox/ChatBox";
import AssignedEvents from "./AssignedEvents";
import AdminRoleAssignment from "./AssignRole";
import ViewProfile from "./ViewProfile";
import OrganizerDashboard from "./OrganizerReport";
import Loader from "../../components/Loading";

const OrganizerLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentComponent, setCurrentComponent] = useState("Dashboard");
 const [loading, setLoading] = useState(true);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 100);
    window.scrollTo(0, 0);
  }, []);
  const renderComponent = () => {
    switch (currentComponent) {
      case "Dashboard":
        return <OrganizerDashboard />;
      case "Events":
        return <Dashboard />; 
      case "Calendar":
        return <Calendar />;
      case "Chat":
        return <ChatBox />;
      case "AssignRole":
        return <AdminRoleAssignment />;
      case "AssignedEvents":
        return <AssignedEvents />;
      case "Profile":
        return <ViewProfile />;
      default:
        return <Dashboard />;
    }
  };
if (loading) {
    return <div><Loader/></div>;
  }
  return (
    <div className="relative min-h-screen flex">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        setCurrentComponent={setCurrentComponent}
      />
      <div className="flex-1 flex flex-col lg:ml-64">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto">{renderComponent()}</main>
      </div>
    </div>
  );
};

export default OrganizerLayout;