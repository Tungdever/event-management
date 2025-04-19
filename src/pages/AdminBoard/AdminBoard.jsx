import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Chart from 'chart.js/auto';
import SidebarAdminBoard from '../AdminBoard/Sidebar';
import Navbar from './Navbar';
const RolePage = () => {
    const roles = [
      { id: 1, name: 'Admin', permissions: ['Read', 'Write', 'Delete'], accounts: 5 },
      { id: 2, name: 'User', permissions: ['Read'], accounts: 100 },
    ];
  
    return (
      <section className="p-6 space-y-6 overflow-y-auto">
        <div className="bg-white rounded-xl p-6">
          <h1 className="font-bold text-sm mb-4 select-none">Role List</h1>
          <table className="w-full text-left text-xs text-gray-700 border-separate border-spacing-y-2">
            <thead>
              <tr className="text-gray-500 font-semibold select-none">
                <th className="pl-4 py-2">Role Name</th>
                <th className="py-2">Permissions</th>
                <th className="pr-4 py-2">Accounts</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.id} className="bg-[#f9fafb] rounded-lg">
                  <td className="pl-4 py-3">{role.name}</td>
                  <td className="py-3">{role.permissions.join(', ')}</td>
                  <td className="pr-4 py-3">{role.accounts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  };
const AdminBoard = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarAdminBoard isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16 lg:ml-64">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminBoard;