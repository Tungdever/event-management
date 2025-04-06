import { useState } from "react";
import { Link } from "react-router-dom";  
import { FaChevronDown, FaTachometerAlt, FaUsers, FaCogs, FaCalendarAlt } from "react-icons/fa"; 
import { MdEvent, MdChat, MdAttachMoney } from "react-icons/md";

// Hàm helper để tạo menu items với eventId
const createMenuItems = (eventId) => [
  {
    title: "Dashboard",
    path: `/dashboard${eventId ? `/${eventId}` : ''}`,
    icon: <FaTachometerAlt />,
    submenu: [
      { title: "Event", path: `/event/detail${eventId ? `/${eventId}` : ''}` }
    ]
  },
  {
    title: "Events",
    path: `/event${eventId ? `/${eventId}` : ''}`,
    icon: <MdEvent />,
    submenu: [
      { 
        title: "Sponsor", 
        path: `/sponsor${eventId ? `/${eventId}` : ''}`,
        sub_submenu: [
          { title: "Create Sponsor", path: `/createSponsor${eventId ? `/${eventId}` : ''}` },
          { title: "Edit Sponsor", path: `/editSponsor${eventId ? `/${eventId}` : ''}` },
        ]
      },
      { 
        title: "Speaker", 
        path: `/speaker${eventId ? `/${eventId}` : ''}`,
        sub_submenu: [
          { title: "Create Speaker", path: `/createSpeaker${eventId ? `/${eventId}` : ''}` },
          { title: "Edit Speaker", path: `/editSpeaker${eventId ? `/${eventId}` : ''}` },
        ]
      },
      { 
        title: "Session", 
        path: `/session${eventId ? `/${eventId}` : ''}`,
        sub_submenu: [
          { title: "Create Section", path: `/createSection${eventId ? `/${eventId}` : ''}` },
          { title: "Edit Section", path: `/editSection${eventId ? `/${eventId}` : ''}` },
        ]
      },
      { title: "Ticket", path: `/ticket${eventId ? `/${eventId}` : ''}` },
    ],
  },
  {
    title: "Team",
    path: `/team${eventId ? `/${eventId}` : ''}`,
    icon: <FaUsers />,
    submenu: [
      { title: "Member", path: `/member${eventId ? `/${eventId}` : ''}` },
      { title: "Task", path: `/task${eventId ? `/${eventId}` : ''}` },
    ],
  },
];

const Sidebar = ({id}) => {
  console.log(id)
  const [eventId] = useState(id);
  const menuItems = createMenuItems(eventId);
  
  const [openMenus, setOpenMenus] = useState(
    menuItems.reduce((acc, menu) => {
      acc[menu.title] = true;
      return acc;
    }, {})
  );

  const [activeSubmenu, setActiveSubmenu] = useState(null);

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
          {menu.submenu.map((sub) => sub && (
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
              {sub.sub_submenu && (
                <ul className="mt-1 ml-4">
                  {sub.sub_submenu.map((subSub) => (
                    <li key={subSub.title}>
                      <Link
                        to={subSub.path}
                        className="block px-2 py-1 text-[13px] text-gray-600 hover:text-[#0357AF] hover:bg-gray-100 rounded"
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