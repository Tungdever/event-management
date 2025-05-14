import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";  
import { FaChevronDown, FaTachometerAlt } from "react-icons/fa"; 
import { MdEvent } from "react-icons/md";
import { useAuth } from "../Auth/AuthProvider";

const createMenuItems = (eventId) => [
  {
    title: "Dashboard",
    path: `/dashboard${eventId ? `/${eventId}` : ''}`,
    icon: <FaTachometerAlt />,
    submenu: [
      { 
        title: "Event", 
        path: `/dashboard/event/detail${eventId ? `/${eventId}` : ''}`,
        roles: ["ORGANIZER"]
      }
    ]
  },
  {
    title: "Events",
    path: `/dashboard/event${eventId ? `/${eventId}` : ''}`,
    icon: <MdEvent />,
    submenu: [
      { 
        title: "Teams", 
        path: `/dashboard/my-team${eventId ? `/${eventId}` : ''}`,
        roles: ["ORGANIZER", "TICKET MANAGER", "EVENT ASSISTANT", "CHECK-IN STAFF"]
      },
      { 
        title: "Sponsor", 
        path: `/dashboard/sponsor${eventId ? `/${eventId}` : ''}`,
        roles: ["ORGANIZER", "TICKET MANAGER", "EVENT ASSISTANT", "CHECK-IN STAFF"]
      },
      { 
        title: "Speaker", 
        path: `/dashboard/speaker${eventId ? `/${eventId}` : ''}`,
        roles: ["ORGANIZER", "TICKET MANAGER", "EVENT ASSISTANT", "CHECK-IN STAFF"] 
      },
      { 
        title: "Session", 
        path: `/dashboard/session${eventId ? `/${eventId}` : ''}`,
        roles: ["ORGANIZER", "TICKET MANAGER", "EVENT ASSISTANT", "CHECK-IN STAFF"]
      },
      { 
        title: "Ticket", 
        path: `/dashboard/ticket${eventId ? `/${eventId}` : ''}`,
        roles: ["ORGANIZER", "TICKET MANAGER", "EVENT ASSISTANT", "CHECK-IN STAFF"]
      },
    ],
  },
];

const Sidebar = ({ id }) => {
  const { user } = useAuth();
  const [eventId] = useState(id);
  const menuItems = createMenuItems(eventId)
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
  };

  return (
    <div className="w-64 h-screen bg-white text-black p-3 border border-r-1 fixed top-0 left-0 overflow-y-auto">
      <h1 className="text-xl font-bold text-orange-500 mb-8 mt-2 hover:cursor-pointer" onClick={handleHomepage}>Management Event</h1>
      <ul>
        {menuItems.map((menu) => (
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
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (path) => {
    navigate(path, { state: { eventId: location.state?.eventId || menu.path.split('/').pop() } });
    if (!menu.submenu) setActiveSubmenu(menu.title);
  };

  return (
    <li className="mb-2">
      <div
        className={`flex justify-between items-center px-2 py-2 rounded-lg cursor-pointer transition-all duration-300 
        text-[14px] font-medium hover:bg-gray-100 hover:text-[#0357AF] ${isOpen ? "bg-[#E6FBFA] text-[#0357AF]" : ""}`}
        onClick={menu.submenu ? onClick : () => handleClick(menu.path)}
      >
        <div className="flex items-center">
          {menu.icon && <span className="mr-2 text-[16px]">{menu.icon}</span>}
          <Link to={menu.path} onClick={(e) => { e.preventDefault(); handleClick(menu.path); }}>
            {menu.title}
          </Link>
        </div>
        {menu.submenu && (
          <FaChevronDown size={12} className={`ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        )}
      </div>
      {menu.submenu && isOpen && (
        <ul className="mt-2 ml-2">
          {menu.submenu.map((sub) => sub && (
            <li key={sub.title}>
              <Link
                to={sub.path}
                className={`block px-2 ml-2 py-3 rounded-lg transition-all text-[14px] 
                ${activeSubmenu === sub.title ? "text-[#0357AF] font-semibold" : "text-gray-700"} 
                hover:bg-gray-100 hover:text-[#0357AF]`}
                onClick={(e) => { e.preventDefault(); handleClick(sub.path); }}
              >
                {sub.title}
              </Link>
              {sub.sub_submenu && (
                <ul className="mt-1 ml-4">
                  {sub.sub_submenu.map((subSub) => (
                    <li key={subSub.title}>
                      <Link
                        to={subSub.path}
                        className="block px-2 py-1 text-[13px] text-gray-600 hover:text-[#0357AF] hover:bg-gray-100 rounded"
                        onClick={(e) => { e.preventDefault(); handleClick(subSub.path); }}
                      >
                        {subSub.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default Sidebar;