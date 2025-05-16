import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaChevronDown, FaTachometerAlt, FaCogs, FaCalendarAlt } from "react-icons/fa";
import { MdChat } from "react-icons/md";
import { useAuth } from "../Auth/AuthProvider";

const defaultMenuItems = [
  {
    title: "Dashboard",
    icon: <FaTachometerAlt />,
    submenu: [
      { title: "Overview", path: "/dashboard", roles: ["ORGANIZER"] },
      { title: "Events", path: "/dashboard/events", roles: ["ORGANIZER"] },
      { title: "Reports", path: "/dashboard/reports", roles: ["ORGANIZER"] },
      { title: "Calendar", path: "/calendar", icon: <FaCalendarAlt />, roles: ["ORGANIZER", "EVENT ASSISTANT", "CHECK-IN STAFF", "TICKET MANAGER"] },
      { title: "Chat", path: "/chat", icon: <MdChat />, roles: ["ORGANIZER", "EVENT ASSISTANT"] },
    ],
  },
  {
    title: "Team && Roles",
    path: "/report",
    icon: <i className="fa-solid fa-chart-simple"></i>,
    submenu: [
      { title: "Assign role", path: "/role", roles: ["ORGANIZER"] },
      { title: "Assigned Events", path: "/assigned-events", roles: ["ORGANIZER", "EVENT ASSISTANT", "CHECK-IN STAFF", "TICKET MANAGER"] },
    ],
  },
  {
    title: "Setting",
    path: "/setting",
    icon: <FaCogs />,
    submenu: [
      { title: "Profile", path: "/view" },
    ],
  },
];

const Sidebar2 = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuth();
  const menuItems = defaultMenuItems
    .map(menu => ({
      ...menu,
      submenu: menu.submenu?.filter(sub => !sub.roles || sub.roles.some(role => user?.primaryRoles?.includes(role)))
    }))
    .filter(menu => !menu.submenu || menu.submenu.length > 0);

  const [openMenus, setOpenMenus] = useState(
    menuItems.reduce((acc, menu) => {
      acc[menu.title] = true;
      return acc;
    }, {})
  );
  const navigate = useNavigate();
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const toggleMenu = (menuTitle) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuTitle]: !prev[menuTitle],
    }));
  };

  const handleHomepage = () => {
    navigate("/");
    if (isOpen) toggleSidebar();
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-white text-black border-r border-gray-200 overflow-y-auto transition-transform duration-300 z-40
        w-[240px] sm:w-56 lg:w-64
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
    >
      <div className="p-2 sm:p-3 lg:p-4">
        <h1
          className="text-xl sm:text-2xl lg:text-[24px] font-bold text-orange-500 mb-6 sm:mb-7 lg:mb-8 mt-2 hover:cursor-pointer truncate"
          onClick={handleHomepage}
        >
          Management Event
        </h1>
        <ul>
          {menuItems.map((menu) => (
            <SidebarItem
              key={menu.title}
              menu={menu}
              isOpen={openMenus[menu.title]}
              onClick={() => toggleMenu(menu.title)}
              activeSubmenu={activeSubmenu}
              setActiveSubmenu={setActiveSubmenu}
              toggleSidebar={toggleSidebar}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

const SidebarItem = ({ menu, isOpen, onClick, activeSubmenu, setActiveSubmenu, toggleSidebar }) => {
  const handleSubmenuClick = (title) => {
    setActiveSubmenu(title);
    if (toggleSidebar) toggleSidebar();
  };

  return (
    <li className="mb-1 sm:mb-2">
      <div
        className={`flex justify-between items-center px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg cursor-pointer transition-all duration-300 
          text-xs sm:text-sm lg:text-[15px] font-medium hover:bg-gray-100 hover:text-[#0357AF] ${isOpen ? "bg-[#E6FBFA] text-[#0357AF]" : ""}`}
        onClick={menu.submenu ? onClick : () => handleSubmenuClick(menu.title)}
      >
        <div className="flex items-center">
          {menu.icon && (
            <span className="mr-1 sm:mr-2 text-sm sm:text-base lg:text-[16px]">{menu.icon}</span>
          )}
          <Link to={menu.path}>{menu.title}</Link>
        </div>
        {menu.submenu && (
          <FaChevronDown
            size={10}
            className={`ml-2 transition-transform sm:text-xs lg:text-sm ${isOpen ? "rotate-180" : ""}`}
          />
        )}
      </div>
      {menu.submenu && isOpen && (
        <ul className="mt-1 sm:mt-2 ml-2 sm:ml-3 lg:ml-4">
          {menu.submenu.map((sub) => (
            <li key={sub.title}>
              <Link
                to={sub.path}
                className={`block px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-3 rounded-lg transition-all text-xs sm:text-sm 
                  ${activeSubmenu === sub.title ? "text-[#0357AF] font-semibold" : "text-gray-700"} 
                  hover:bg-gray-100 hover:text-[#0357AF]`}
                onClick={() => handleSubmenuClick(sub.title)}
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

export default Sidebar2;