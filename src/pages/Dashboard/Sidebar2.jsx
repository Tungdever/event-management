import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";  
import { FaChevronDown, FaTachometerAlt, FaUsers, FaCogs, FaCalendarAlt } from "react-icons/fa"; 
import { MdEvent, MdChat, MdAttachMoney } from "react-icons/md";
const defaultMenuItems = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <FaTachometerAlt />,
    submenu: [
      { title: "Manager", path: "/dashboard" },   
      { title: "Chat", path: "/chat" ,icon: <MdChat /> },
      { title: "Calendar", path: "/calendar",icon: <FaCalendarAlt /> }
    ]
  },
  {
    title: "Report",
    path: "/report",
    icon: <i class="fa-solid fa-chart-simple"></i>,
    submenu: [
      { title: "Order", path: "/order" },]
  },
  {
    title: "Setting",
    path: "/setting",
    icon: <FaCogs />,
    submenu: [
      { title: "Profile", path: "/view" },
      { title: "Notification", path: "/notification" },
    ],
  },
];

const Sidebar2 = () => {
  const [openMenus, setOpenMenus] = useState(
    defaultMenuItems.reduce((acc, menu) => {
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
  const handleHomepage = (e) => {
    
    navigate("/"); 
  };
  return (
    <div className="w-64 h-screen bg-white text-black p-2 border border-r-1 fixed top-0 left-0 overflow-y-auto">
      <h1 className="text-[24px] font-bold text-orange-500 mb-8 mt-2 hover:cursor-pointer" onClick={handleHomepage}>Management Event</h1>
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
        text-[14px] font-medium hover:bg-gray-100 hover:text-[#0357AF] ${isOpen ? "bg-[#E6FBFA] text-[#0357AF]" : ""}`}
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
                ${activeSubmenu === sub.title ? "text-[#0357AF] font-semibold" : "text-gray-700"} 
                hover:bg-gray-100 hover:text-[#0357AF]`}
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

export default Sidebar2;
