import React from 'react';
import { NavLink } from 'react-router-dom';

const SidebarAdminBoard = ({ isSidebarOpen, toggleSidebar }) => {
  const dashboardItems = [
    { name: 'Dashboard', icon: 'fas fa-shopping-cart', path: '/admin' },
  ];

  const conceptItems = [
    { name: 'User', icon: 'fas fa-user', path: '/admin/user', hasDropdown: true },
    { name: 'Role', icon: 'fas fa-box', path: '/admin/role', hasDropdown: true },
  ];

  return (
    <aside
      className={`bg-white w-64 flex flex-col border-r border-gray-200 fixed top-0 left-0 h-screen transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform z-20 overflow-y-auto`}
    >
      <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-200">
        <div className="bg-[#1e293b] text-white rounded-full p-2">
          <i className="fas fa-cube fa-lg"></i>
        </div>
        <span className="font-extrabold text-lg select-none">Management Event</span>
      </div>
      <nav className="flex-1 px-6 py-4 text-sm text-gray-600">
        <p className="uppercase font-semibold text-xs mb-3 select-none">DASHBOARD</p>
        <ul className="space-y-3">
          {dashboardItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 ${isActive ? 'text-[#3b82f6] font-semibold' : 'hover:text-[#3b82f6]'}`
                }
                onClick={() => toggleSidebar()}
              >
                <i className={item.icon}></i>
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
        <p className="uppercase font-semibold text-xs mt-8 mb-3 select-none">CONCEPTS</p>
        <ul className="space-y-3">
          {conceptItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 ${isActive ? 'text-[#3b82f6] font-semibold' : 'hover:text-[#3b82f6]'}`
                }
                onClick={() => toggleSidebar()}
              >
                <i className={item.icon}></i>
                {item.name}
                {item.hasDropdown}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default SidebarAdminBoard;