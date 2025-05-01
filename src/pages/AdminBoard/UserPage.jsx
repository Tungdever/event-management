import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Chart from 'chart.js/auto';

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    gender: '',
    birthday: '',
    address: '',
    roles: [],
    organizer: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = localStorage.getItem('token');

  // Lấy danh sách users
  const fetchUsers = async () => {
    try {
      setError(null);
      if (!token) throw new Error('No token found');
      const response = await fetch('http://localhost:8080/api/auth/users', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err.message);
      setUsers([]);
    }
  };

  // Lấy danh sách roles
  const fetchRoles = async () => {
    try {
      setError(null);
      if (!token) throw new Error('No token found');
      const response = await fetch('http://localhost:8080/api/roles', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch roles');
      const data = await response.json();
      setRoles(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err.message);
      setRoles([]);
    }
  };

  // Tạo user mới
  const createUser = async (userData) => {
    try {
      setError(null);
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create user');
      }
      await fetchUsers();
    } catch (err) {
      throw err;
    }
  };

  // Cập nhật user
  const updateUser = async (userData) => {
    try {
      setError(null);
      const response = await fetch('http://localhost:8080/api/auth/save-change', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }
      await fetchUsers();
    } catch (err) {
      throw err;
    }
  };

  // Xóa user
  const deleteUser = async (email) => {
    try {
      setError(null);
      const response = await fetch(`http://localhost:8080/api/auth/users/${email}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete user');
      }
      await fetchUsers();
    } catch (err) {
      throw err;
    }
  };

  // Thêm role cho user
  const addRoleToUser = async (email, roleName) => {
    try {
      setError(null);
      const response = await fetch(`http://localhost:8080/api/auth/${email}/add-new-role/${roleName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add role');
      }
      await fetchUsers();
    } catch (err) {
      throw err;
    }
  };

  // Xóa role khỏi user
  const removeRoleFromUser = async (email, roleName) => {
    try {
      setError(null);
      const response = await fetch(`http://localhost:8080/api/auth/${email}/remove-role/${roleName}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to remove role');
      }
      await fetchUsers();
    } catch (err) {
      throw err;
    }
  };

  // Nâng cấp user thành organizer
  const upgradeToOrganizer = async (email, organizerData) => {
    try {
      setError(null);
      const response = await fetch(`http://localhost:8080/api/auth/user/upgrade-organizer/${email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(organizerData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upgrade to organizer');
      }
      await fetchUsers();
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const openPopup = (type, user = null) => {
    setPopupType(type);
    setSelectedUser(user);
    if (type === 'editUser' && user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        password: '',
        gender: user.gender || '',
        birthday: user.birthday || '',
        address: user.address || '',
        roles: user.roles ? user.roles.map((role) => role.name) : [],
        organizer: user.organizer || null,
      });
    } else if (type === 'upgradeOrganizer' && user) {
      setFormData({
        organizerName: '',
        organizerAddress: '',
        organizerWebsite: '',
        organizerPhone: '',
        organizerDesc: '',
      });
    } else {
      setFormData({
        fullName: '',
        email: '',
        password: '',
        gender: '',
        birthday: '',
        address: '',
        roles: [],
        organizer: null,
      });
    }
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupType(null);
    setSelectedUser(null);
    setFormData({
      fullName: '',
      email: '',
      password: '',
      gender: '',
      birthday: '',
      address: '',
      roles: [],
      organizer: null,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (popupType === 'upgradeOrganizer') {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRoleToggle = (roleName) => {
    setFormData((prev) => {
      const roles = prev.roles.includes(roleName)
        ? prev.roles.filter((r) => r !== roleName)
        : [...prev.roles, roleName];
      return { ...prev, roles };
    });
  };

  const handleSubmit = async () => {
    if (popupType !== 'deleteUser' && !formData.email.trim()) return;
    setIsSubmitting(true);
    try {
      if (popupType === 'createUser') {
        await createUser({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          gender: formData.gender,
          birthday: formData.birthday,
          address: formData.address,
          roles: formData.roles.map((name) => ({ name })),
        });
      } else if (popupType === 'editUser') {
        await updateUser({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          gender: formData.gender,
          birthday: formData.birthday,
          address: formData.address,
          roles: formData.roles.map((name) => ({ name })),
        });
      } else if (popupType === 'deleteUser') {
        await deleteUser(selectedUser.email);
      } else if (popupType === 'addRole') {
        const roleName = formData.roles[0];
        if (roleName) {
          await addRoleToUser(selectedUser.email, roleName);
        }
      } else if (popupType === 'removeRole') {
        const roleName = formData.roles[0];
        if (roleName) {
          await removeRoleFromUser(selectedUser.email, roleName);
        }
      } else if (popupType === 'upgradeOrganizer') {
        await upgradeToOrganizer(selectedUser.email, {
          organizerName: formData.organizerName,
          organizerAddress: formData.organizerAddress,
          organizerWebsite: formData.organizerWebsite,
          organizerPhone: formData.organizerPhone,
          organizerDesc: formData.organizerDesc,
        });
      }
      closePopup();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Thống kê
  const totalUsers = users.length;
  const roleStats = roles.reduce((acc, role) => {
    acc[role.name] = users.filter((user) =>
      user.roles.some((r) => r.name === role.name)
    ).length;
    return acc;
  }, {});

  // Popup Component
  const Popup = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-3xl max-h-[80vh] overflow-y-auto">
        <h3 className="font-bold text-sm mb-4 select-none">
          {popupType === 'createUser' && 'Create User'}
          {popupType === 'editUser' && 'Edit User'}
          {popupType === 'deleteUser' && 'Delete User'}
          {popupType === 'addRole' && 'Add Role to User'}
          {popupType === 'removeRole' && 'Remove Role from User'}
          {popupType === 'upgradeOrganizer' && 'Upgrade to Organizer'}
        </h3>
        {(popupType === 'createUser' || popupType === 'editUser') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-gray-600 text-xs mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-100 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter full name"
                disabled={isSubmitting}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 text-xs mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-100 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter email"
                disabled={isSubmitting || popupType === 'editUser'}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 text-xs mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-100 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter password"
                disabled={isSubmitting}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 text-xs mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-100 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                disabled={isSubmitting}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 text-xs mb-1">Birthday</label>
              <input
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-100 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                disabled={isSubmitting}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 text-xs mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-100 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter address"
                disabled={isSubmitting}
              />
            </div>
            <div className="mb-4 col-span-1 md:col-span-2">
              <label className="block text-gray-600 text-xs mb-1">Roles</label>
              <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md p-2">
                {roles.map((role) => (
                  <div key={role.name} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={formData.roles.includes(role.name)}
                      onChange={() => handleRoleToggle(role.name)}
                      className="mr-2"
                      disabled={isSubmitting}
                    />
                    <span className="text-sm">{role.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {(popupType === 'addRole' || popupType === 'removeRole') && (
          <div className="mb-4">
            <label className="block text-gray-600 text-xs mb-1">Select Role</label>
            <select
              name="roles"
              value={formData.roles[0] || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, roles: [e.target.value] }))}
              className="w-full p-2 bg-gray-100 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              disabled={isSubmitting}
            >
              <option value="">Select a role</option>
              {roles
                .filter((role) => popupType === 'addRole' || selectedUser.roles.some((r) => r.name === role.name))
                .map((role) => (
                  <option key={role.name} value={role.name}>
                    {role.name}
                  </option>
                ))}
            </select>
          </div>
        )}
        {popupType === 'deleteUser' && (
          <p className="text-sm text-gray-600 mb-4">
            Are you sure you want to delete <span className="font-semibold">{selectedUser.email}</span>?
          </p>
        )}
        {popupType === 'upgradeOrganizer' && (
          <>
            <div className="mb-4">
              <label className="block text-gray-600 text-xs mb-1">Organizer Name</label>
              <input
                type="text"
                name="organizerName"
                value={formData.organizerName}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-100 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter organizer name"
                disabled={isSubmitting}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 text-xs mb-1">Organizer Address</label>
              <input
                type="text"
                name="organizerAddress"
                value={formData.organizerAddress}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-100 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter organizer address"
                disabled={isSubmitting}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 text-xs mb-1">Organizer Website</label>
              <input
                type="text"
                name="organizerWebsite"
                value={formData.organizerWebsite}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-100 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter organizer website"
                disabled={isSubmitting}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 text-xs mb-1">Organizer Phone</label>
              <input
                type="text"
                name="organizerPhone"
                value={formData.organizerPhone}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-100 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter organizer phone"
                disabled={isSubmitting}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 text-xs mb-1">Organizer Description</label>
              <textarea
                name="organizerDesc"
                value={formData.organizerDesc}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-100 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter organizer description"
                disabled={isSubmitting}
              />
            </div>
          </>
        )}
        <div className="flex justify-end gap-2">
          <button
            onClick={closePopup}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 text-gray-700 disabled:bg-gray-300 disabled:text-gray-500"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center disabled:bg-blue-400"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            {isSubmitting
              ? 'Submitting...'
              : popupType === 'deleteUser'
              ? 'Delete'
              : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <section className="p-6 space-y-6 overflow-y-auto">
      <h1 className="font-bold text-lg mb-4 select-none">User Management Dashboard</h1>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {/* Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700">Total Users</h3>
          <p className="text-2xl font-bold text-blue-600">{totalUsers}</p>
        </div>
        {roles.map((role) => (
          <div key={role.name} className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700">{role.name}</h3>
            <p className="text-2xl font-bold text-blue-600">{roleStats[role.name] || 0}</p>
          </div>
        ))}
      </div>

      {/* Danh sách users */}
      <div className="bg-white rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-sm text-gray-800">User List</h2>
          <button
            onClick={() => openPopup('createUser')}
            className="text-xs bg-blue-600 text-white rounded-full px-3 py-1 hover:bg-blue-700 disabled:bg-blue-400"
            disabled={isSubmitting}
          >
            Create User
          </button>
        </div>
        {users.length > 0 ? (
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
              {users.map((user) => (
                <tr
                  key={user.userId}
                  className="bg-[#f9fafb] rounded-lg cursor-pointer"
                  onClick={() => setSelectedUser(user)}
                >
                  <td className="pl-4 py-3 font-semibold">{user.fullName}</td>
                  <td className="py-3">{user.email}</td>
                  <td className="py-3">{user.roles.map((r) => r.name).join(', ')}</td>
                  <td className="py-3">{user.isActive ? 'Active' : 'Inactive'}</td>
                  <td className="pr-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        title="Edit"
                        onClick={() => openPopup('editUser', user)}
                        className="text-gray-600 hover:text-yellow-600 disabled:text-gray-400"
                        disabled={isSubmitting}
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        title="Delete"
                        onClick={() => openPopup('deleteUser', user)}
                        className="text-gray-600 hover:text-red-600 disabled:text-gray-400"
                        disabled={isSubmitting}
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                      <button
                        title="Add Role"
                        onClick={() => openPopup('addRole', user)}
                        className="text-gray-600 hover:text-blue-600 disabled:text-gray-400"
                        disabled={isSubmitting}
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </button>
                      <button
                        title="Remove Role"
                        onClick={() => openPopup('removeRole', user)}
                        className="text-gray-600 hover:text-red-600 disabled:text-gray-400"
                        disabled={isSubmitting}
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M20 12H4"
                          />
                        </svg>
                      </button>
                      {!user.organizer && (
                        <button
                          title="Upgrade to Organizer"
                          onClick={() => openPopup('upgradeOrganizer', user)}
                          className="text-gray-600 hover:text-green-600 disabled:text-gray-400"
                          disabled={isSubmitting}
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 11l7-7 7 7M5 19l7-7 7 7"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 text-sm">No users available.</p>
        )}
        {selectedUser && (
          <div className="mt-4 p-4 bg-[#f9fafb] rounded-lg">
            <h3 className="font-bold text-sm select-none">User Details</h3>
            <p><strong>Name:</strong> {selectedUser.fullName}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Roles:</strong> {selectedUser.roles.map((r) => r.name).join(', ')}</p>
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
          </div>
        )}
      </div>

      {/* Render Popup using Portal */}
      {showPopup && createPortal(<Popup />, document.body)}
    </section>
  );
};

export default UserPage;