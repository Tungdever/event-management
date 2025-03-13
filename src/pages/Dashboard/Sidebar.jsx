import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";  

const defaultMenuItems = [
  {
    title: "Dashboard",
    path: "/dashboard",
    submenu: [
      { title: "Dashboard", path: "/dashboard" },]
  },
  {
    title: "Events",
    path: "/event",
    submenu: [
      { title: "Management event", path: "",sub_submenu :[
        { title: "Create event", path: "/createEvent" },
        { title: "Edit event", path: "/editEvent" },
      ] },
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
      { title: "Chat", path: "/chat" },
      { title: "Ticket", path: "/ticket" },
      { title: "Order", path: "/order" },
      { title: "Finance", path: "/finance" },
    ],
  },
  {
    title: "Team",
    path: "/team",
    submenu: [
      { title: "Member", path: "/member" },
      { title: "Task", path: "/task" },
      { title: "Calendar", path: "/calendar" },
    ],
  },
  {
    title: "Setting",
    path: "/setting",
    submenu: [
      { title: "Profile", path: "/profile" },
      { title: "Notification", path: "/notification" },
    ],
  },
];

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (menuTitle) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuTitle]: !prev[menuTitle],
    }));
  };

  return (
    <div className="w-64 h-screen bg-white text-black p-2 shadow-lg fixed top-0 left-0 overflow-y-auto">
      <h1 className="text-2xl font-bold text-orange-500 mb-8">Management Event</h1>
      <ul>
        {defaultMenuItems.map((menu) => (
          <SidebarItem
            key={menu.title}
            menu={menu}
            isOpen={openMenus[menu.title]}
            onClick={() => toggleMenu(menu.title)}
          />
        ))}
      </ul>
    </div>
  );
};

const SidebarItem = ({ menu, isOpen, onClick }) => {
  return (
    <li className="mb-2">
      <div
        className={`flex justify-between items-center px-2 py-2 rounded-lg cursor-pointer transition-all duration-300 
        text-[14px] font-semibold hover:bg-orange-500 hover:text-white ${isOpen ? "bg-orange-500 text-white" : ""}`}
        onClick={menu.submenu ? onClick : null}
      >
        <Link to={menu.path}>{menu.title}</Link>
        {menu.submenu && (
          <FaChevronDown className={`ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        )}
      </div>
      {menu.submenu && isOpen && (
        <ul className="mt-2 ml-4">
          {menu.submenu.map((sub) => (
            <li key={sub.title}>
              <Link
                to={sub.path}
                className="block px-3 py-2 text-gray-700 hover:bg-orange-400 hover:text-white rounded-lg transition-all text-[14px]"
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
