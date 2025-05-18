import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";  
import { FaTachometerAlt, FaUsers, FaChartLine, FaTicketAlt, FaMicrophone } from "react-icons/fa"; 
import { MdEvent } from "react-icons/md";
import { useAuth } from "../Auth/AuthProvider";

const createMenuItems = (eventId) => [
  
  {
    path: `/dashboard/event/detail${eventId ? `/${eventId}` : ''}`,
    displayName: "Events",
    icon: <MdEvent />,
    roles: ["ORGANIZER", "TICKET MANAGER", "EVENT ASSISTANT", "CHECK-IN STAFF"]
  },
  {
    path: `/dashboard/sponsor${eventId ? `/${eventId}` : ''}`,
    displayName: "Sponsor",
    icon: <FaUsers />,
    roles: ["ORGANIZER", "TICKET MANAGER", "EVENT ASSISTANT", "CHECK-IN STAFF"]
  },
  {
    path: `/dashboard/ticket${eventId ? `/${eventId}` : ''}`,
    displayName: "Ticket",
    icon: <FaTicketAlt />,
    roles: ["ORGANIZER", "TICKET MANAGER", "EVENT ASSISTANT", "CHECK-IN STAFF"]
  }
];

const Sidebar = ({ id }) => {
  const { user } = useAuth();
  const [eventId] = useState(id);
  const menuItems = createMenuItems(eventId)
    .filter(menu => !menu.roles || menu.roles.some(role => user?.primaryRoles?.includes(role)));
  
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(null);

  const handleHomepage = () => {
    navigate("/"); 
  };

  return (
    <div className="w-64 h-screen bg-white text-black p-3 border border-r-1 fixed top-0 left-0 overflow-y-auto">
      <h1 className="text-xl font-bold text-orange-500 mb-8 mt-2 hover:cursor-pointer" onClick={handleHomepage}>Management Event</h1>
      <ul>
        {menuItems.map((menu) => (
          <SidebarItem
            key={menu.path}
            menu={menu}
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
          />
        ))}
      </ul>
    </div>
  );
};

const SidebarItem = ({ menu, activeMenu, setActiveMenu }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (path) => {
    navigate(path, { state: { eventId: location.state?.eventId || menu.path.split('/').pop() } });
    setActiveMenu(path);
  };

  return (
    <li className="mb-2">
      <div
        className={`flex items-center px-2 py-2 rounded-lg cursor-pointer transition-all duration-300 
        text-[14px] font-medium hover:bg-gray-100 hover:text-[#0357AF] 
        ${activeMenu === menu.path ? "bg-[#E6FBFA] text-[#0357AF]" : ""}`}
        onClick={() => handleClick(menu.path)}
      >
        {menu.icon && <span className="mr-2 text-[16px]">{menu.icon}</span>}
        <Link to={menu.path} onClick={(e) => { e.preventDefault(); handleClick(menu.path); }}>
          {menu.displayName}
        </Link>
      </div>
    </li>
  );
};

export default Sidebar;