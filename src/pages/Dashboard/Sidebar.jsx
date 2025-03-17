import { useState } from "react";

import { Link } from "react-router-dom";  
import { FaChevronDown, FaTachometerAlt, FaUsers, FaCogs, FaCalendarAlt } from "react-icons/fa"; 
import { MdEvent, MdChat, MdAttachMoney } from "react-icons/md";
const defaultMenuItems = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <FaTachometerAlt />,
    submenu: [
      { title: "Manager", path: "/dashboard" },]
  },
  {
    title: "Events",
    path: "/event",
    icon: <MdEvent />,
    submenu: [
      ,
      { title: "Sponsor", path: "/sponsor",sub_submenu :[
        { title: "Create Sponsor", path: "/createSponsor" },
        { title: "Edit Sponsor", path: "/editSponsor" },
      ] },
      { title: "Speaker", path: "/speaker",sub_submenu :[
        { title: "Create Speaker", path: "/createSpeaker" },
        { title: "Edit Speaker", path: "/editSpeaker" },
      ] },
      { title: "Section", path: "/section" ,sub_submenu :[
        { title: "Create Section", path: "/createSection" },
        { title: "Edit Section", path: "/editSection" },
      ] },
      { title: "Attendee", path: "/attendee" },
      { title: "Chat", path: "/chat" ,icon: <MdChat /> },
      { title: "Ticket", path: "/ticket" },
     
    ],
  },
  {
    title: "Team",
    path: "/team",
    icon: <FaUsers />,
    submenu: [
      { title: "Member", path: "/member" },
      { title: "Task", path: "/task" },
      { title: "Calendar", path: "/calendar",icon: <FaCalendarAlt /> },
    ],
  },
  {
    title: "Setting",
    path: "/setting",
    icon: <FaCogs />,
    submenu: [
      { title: "Profile", path: "/profile" },
      { title: "Notification", path: "/notification" },
    ],
  },
];

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState(
    defaultMenuItems.reduce((acc, menu) => {
      acc[menu.title] = true;
      return acc;
    }, {})
  );

  const [activeSubmenu, setActiveSubmenu] = useState(null); // Lưu trạng thái submenu đang active

  const toggleMenu = (menuTitle) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuTitle]: !prev[menuTitle],
    }));
  };

  return (
    <div className="w-64 h-screen bg-white text-black p-2 border border-r-1 fixed top-0 left-0 overflow-y-auto">
      <h1 className="text-2xl font-bold text-orange-500 mb-8 mt-2">Management Event</h1>
      <ul>
        {defaultMenuItems.map((menu) => (
          <SidebarItem
            key={menu.title}
            menu={menu}
            isOpen={openMenus[menu.title]}
            onClick={() => toggleMenu(menu.title)}
            activeSubmenu={activeSubmenu}
            setActiveSubmenu={setActiveSubmenu}
          />
        ))}
      </ul>
    </div>
  );
};

const SidebarItem = ({ menu, isOpen, onClick, activeSubmenu, setActiveSubmenu }) => {
  return (
    <li className="mb-2">
      <div
        className={`flex justify-between items-center px-2 py-2 rounded-lg cursor-pointer transition-all duration-300 
        text-[14px] font-medium hover:bg-gray-100 hover:text-orange-500 ${isOpen ? "bg-gray-200 text-orange-500" : ""}`}
        onClick={menu.submenu ? onClick : null}
      >
        <div className="flex items-center">
          {menu.icon && <span className="mr-2 text-[16px]">{menu.icon}</span>}
          <Link to={menu.path}>{menu.title}</Link>
        </div>
        {menu.submenu && (
          <FaChevronDown size={12} className={`ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        )}
      </div>
      {menu.submenu && isOpen && (
        <ul className="mt-2 ml-2">
          {menu.submenu.map((sub) => (
            <li key={sub.title}>
              <Link
                to={sub.path}
                className={`block px-2 ml-2 py-2 rounded-lg transition-all text-[14px] 
                ${activeSubmenu === sub.title ? "text-orange-600 font-semibold" : "text-gray-700"} 
                hover:bg-gray-100 hover:text-orange-500`}
                onClick={() => setActiveSubmenu(sub.title)}
              >
                {sub.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default Sidebar;
