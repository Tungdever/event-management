import React, { useEffect, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import UserEditPopup from './UserEditPopup';
import { FaUserFriends, FaUsers } from "react-icons/fa";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [filterRole, setFilterRole] = useState(null); // Trạng thái lọc theo vai trò
  const token = localStorage.getItem('token');

  // Fetch users
  const fetchUsers = async () => {
    try {
      setError(null);
      if (!token) throw new Error('No token found');
      const response = await fetch('http://localhost:8080/api/auth/users', {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err.message);
      setUsers([]);
    }
  };

  // Fetch roles
  const fetchRoles = async () => {
    try {
      setError(null);
      if (!token) throw new Error('No token found');
      const response = await fetch('http://localhost:8080/api/roles/ADMIN/created', {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch roles');
      const data = await response.json();
      setRoles(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err.message);
      setRoles([]);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const openPopup = (type, user = null) => {
    setPopupType(type);
    setSelectedUser(user);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupType(null);
    setSelectedUser(null);
  };

  // Handle row click to show or hide tooltip
  const handleRowClick = (user) => {
    if (selectedUser && selectedUser.userId === user.userId) {
      setShowTooltip(false);
      setSelectedUser(null);
    } else {
      setSelectedUser(user);
      setShowTooltip(true);
    }
  };

  // Handle filter by role
  const handleFilterRole = (roleName) => {
    setFilterRole(roleName);
  };

  // Filter users based on selected role
  const filteredUsers = filterRole
    ? users.filter((user) => user.roles.some((r) => r.name === filterRole))
    : users;

  // Statistics
  const totalUsers = users.length;
  const roleStats = roles.reduce((acc, role) => {
    acc[role.name] = users.filter((user) =>
      user.roles.some((r) => r.name === role.name)
    ).length;
    return acc;
  }, {});

  return (
    <section className="p-6 space-y-6 overflow-y-auto">
      <h1 className="font-bold text-2xl mb-4 select-none">User Management Dashboard</h1>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {/* Statistics */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-6">
        <div
          className="bg-white rounded-xl p-4 border border-gray-200 w-[200px] cursor-pointer hover:bg-gray-100"
          onClick={() => handleFilterRole(null)}
        >
          <h3 className="text-sm font-semibold text-gray-700">Total Users</h3>
          <div className="flex space-x-2 gap-4 p-2 items-center">
            <FaUserFriends />
            <p className="text-2xl font-bold text-blue-600">{totalUsers}</p>
          </div>
        </div>
        {roles.map((role) => (
          <div
            key={role.name}
            className="bg-[#ECEAE4] rounded-xl p-4 shadow-md w-[200px] cursor-pointer hover:bg-gray-200"
            onClick={() => handleFilterRole(role.name)}
          >
            <h3 className="text-[12px] font-semibold text-gray-700 font-montserrat">
              {role.name.replace('ROLE_', '')}
            </h3>
            <div className="flex space-x-2 gap-4 p-2 items-center">
              <FaUsers />
              <p className="text-2xl font-bold text-blue-600">{roleStats[role.name] || 0}</p>
            </div>
          </div>
        ))}
      </div>

      {/* User list */}
      <div className="bg-white rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-sm text-gray-800">User List</h2>
          <button
            onClick={() => openPopup('createUser')}
            className="text-xs bg-blue-600 text-white rounded-full px-3 py-1 hover:bg-blue-700 disabled:bg-blue-400"
          >
            Create User
          </button>
        </div>
        {filteredUsers.length > 0 ? (
          <table className="w-full text-left text-xs text-gray-700 border-separate border-spacing-y-2">
            <thead>
              <tr className="text-gray-500 font-semibold select-none">
                <th className="pl-4 py-2">Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Roles</th>
                <th className="py-2">Status</th>
                <th className="pr-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.userId}
                  className="bg-[#f9fafb] rounded-lg cursor-pointer"
                  onClick={() => handleRowClick(user)}
                  data-tooltip-id={`user-tooltip-${user.userId}`}
                >
                  <td className="pl-4 py-3 font-semibold">{user.fullName}</td>
                  <td className="py-3">{user.email}</td>
                  <td className="py-3">{user.roles.map((r) => r.name.replace('ROLE_', '')).join(', ')}</td>
                  <td className="py-3">{user.isActive ? 'Active' : 'Inactive'}</td>
                  <td className="pr-4 py-3 text-right">
                    {user.fullName.toLowerCase() !== 'admin' ? (
                      <div className="flex justify-end gap-2">
                        <button
                          title="Edit"
                          onClick={(e) => { e.stopPropagation(); openPopup('editUser', user); }}
                          className="text-gray-600 hover:text-yellow-600 disabled:text-gray-400"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          title="Delete"
                          onClick={(e) => { e.stopPropagation(); openPopup('deleteUser', user); }}
                          className="text-gray-600 hover:text-red-600 disabled:text-gray-400"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                        <button
                          title="Add Role"
                          onClick={(e) => { e.stopPropagation(); openPopup('addRole', user); }}
                          className="text-gray-600 hover:text-blue-600 disabled:text-gray-400"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                        <button
                          title="Remove Role"
                          onClick={(e) => { e.stopPropagation(); openPopup('removeRole', user); }}
                          className="text-gray-600 hover:text-red-600 disabled:text-gray-400"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                          </svg>
                        </button>
                        {!user.roles.some((r) => r.name === 'ROLE_ORGANIZER') && (
                          <button
                            title="Upgrade to Organizer"
                            onClick={(e) => { e.stopPropagation(); openPopup('upgradeOrganizer', user); }}
                            className="text-gray-600 hover:text-green-600 disabled:text-gray-400"
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11l7-7 7 7M5 19l7-7 7 7" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2 invisible">
                        {/* Placeholder để giữ chiều rộng cột */}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 text-sm">No users available.</p>
        )}

        {/* Tooltip for User Details */}
        {selectedUser && selectedUser.fullName.toLowerCase() !== 'admin' && (
          <Tooltip
            id={`user-tooltip-${selectedUser.userId}`}
            place="right"
            effect="solid"
            isOpen={showTooltip}
            clickable={true}
            className="bg-[#f9fafb] rounded-lg p-4 shadow-lg max-w-sm z-50"
            afterHide={() => setShowTooltip(false)}
          >
            <h3 className="font-bold text-sm select-none">User Details</h3>
            <p><strong>Name:</strong> {selectedUser.fullName}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Roles:</strong> {selectedUser.roles.map((r) => r.name.replace('ROLE_', '')).join(', ')}</p>
            <p><strong>Status:</strong> {selectedUser.isActive ? 'Active' : 'Inactive'}</p>
            {selectedUser.organizer && (
              <div>
                <p><strong>Organizer Name:</strong> {selectedUser.organizer.organizerName}</p>
                <p><strong>Organizer Address:</strong> {selectedUser.organizer.organizerAddress || 'N/A'}</p>
                <p><strong>Organizer Website:</strong> {selectedUser.organizer.organizerWebsite || 'N/A'}</p>
                <p><strong>Organizer Phone:</strong> {selectedUser.organizer.organizerPhone || 'N/A'}</p>
                <p><strong>Organizer Description:</strong> {selectedUser.organizer.organizerDesc || 'N/A'}</p>
              </div>
            )}
          </Tooltip>
        )}

        {/* Render Popup */}
        {showPopup && (
          <UserEditPopup
            popupType={popupType}
            selectedUser={selectedUser}
            roles={roles}
            token={token}
            onClose={closePopup}
            onSubmitSuccess={fetchUsers}
            setError={setError}
          />
        )}
      </div>
    </section>
  );
};

export default UserPage;