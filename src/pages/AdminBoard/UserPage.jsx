import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Chart from 'chart.js/auto';

const UserPage = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
  
    const users = [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'User', status: 'Approved' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Admin', status: 'Approved' },
    ];
  
    const handleRowClick = (user) => {
      setSelectedUser(user);
    };
  
    return (
      <section className="p-6 space-y-6 overflow-y-auto">
        <div className="bg-white rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-bold text-sm select-none">User List</h1>
            <button
              onClick={() => setShowPopup(true)}
              className="text-xs bg-blue-600 text-white rounded-full px-3 py-1 hover:bg-blue-700"
            >
              Create User
            </button>
          </div>
          <table className="w-full text-left text-xs text-gray-700 border-separate border-spacing-y-2">
            <thead>
              <tr className="text-gray-500 font-semibold select-none">
                <th className="pl-4 py-2">Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Role</th>
                <th className="py-2">Status</th>
                <th className="pr-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="bg-[#f9fafb] rounded-lg cursor-pointer"
                  onClick={() => handleRowClick(user)}
                >
                  <td className="pl-4 py-3 font-semibold">
                    <div className="flex items-center gap-3">
                      <img
                        className="w-6 h-6 rounded-full object-cover"
                        src="https://storage.googleapis.com/a1aa/image/e4f12221-4458-451f-8c75-d0cbd687aa24.jpg"
                        alt=""
                      />
                      {user.name}
                    </div>
                  </td>
                  <td className="py-3">{user.email}</td>
                  <td className="py-3">{user.role}</td>
                  <td className="py-3">{user.status}</td>
                  <td className="pr-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button title="View" className="text-gray-600 hover:text-blue-600">
                        <i className="fas fa-eye"></i>
                      </button>
                      <button title="Edit" className="text-gray-600 hover:text-blue-600">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button title="Delete" className="text-gray-600 hover:text-blue-600">
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {selectedUser && (
            <div className="mt-4 p-4 bg-[#f9fafb] rounded-lg">
              <h3 className="font-bold text-sm select-none">User Details</h3>
              <p>Name: {selectedUser.name}</p>
              <p>Email: {selectedUser.email}</p>
              <p>Role: {selectedUser.role}</p>
              <p>Status: {selectedUser.status}</p>
            </div>
          )}
          {showPopup && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
              <div className="bg-white p-6 rounded-xl w-full max-w-md">
                <h3 className="font-bold text-sm mb-4 select-none">Create User</h3>
                <div className="mb-4">
                  <label className="block text-gray-600 text-xs mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full p-2 bg-gray-100 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-600 text-xs mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full p-2 bg-gray-100 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-600 text-xs mb-1">Role</label>
                  <select
                    className="w-full p-2 bg-gray-100 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option>User</option>
                    <option>Admin</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-600 text-xs mb-1">Permissions</label>
                  <div className="flex flex-col gap-2">
                    <label>
                      <input type="checkbox" className="mr-2 text-blue-600 focus:ring-blue-400" /> Read
                    </label>
                    <label>
                      <input type="checkbox" className="mr-2 text-blue-600 focus:ring-blue-400" /> Write
                    </label>
                    <label>
                      <input type="checkbox" className="mr-2 text-blue-600 focus:ring-blue-400" /> Delete
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowPopup(false)}
                    className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 text-gray-700"
                  >
                    Cancel
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  };

  export default UserPage