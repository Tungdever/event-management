
import React, { useState, useEffect } from 'react';

const RolePage = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState(null); 
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [newPermission, setNewPermission] = useState({ name: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('Roles');
  const token = localStorage.getItem('token');

  // Lấy danh sách roles
  const fetchRole = async () => {
    try {
      setError(null);
      if (!token) {
        throw new Error('No token found');
      }
      const response = await fetch('http://localhost:8080/api/roles', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch roles');
      }
      const data = await response.json();
      setRoles(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err.message);
      setRoles([]);
    }
  };

  // Lấy danh sách permissions
  const fetchPermission = async () => {
    try {
      setError(null);
      if (!token) {
        throw new Error('No token found');
      }
      const response = await fetch(`http://localhost:8080/api/permissions`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch permissions');
      }
      const data = await response.json();
      
      setPermissions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      setPermissions([]);
    }
  };

  // Thêm permission vào role
  const addPermissionToDB = async (roleId, permission) => {
    setError(null);
    const previousRoles = [...roles];
    setRoles((prev) =>
      prev.map((role) =>
        role.roleID === roleId
          ? { ...role, permissions: [...role.permissions, permission] }
          : role
      )
    );

    try {
      const response = await fetch(`http://localhost:8080/api/roles/${roleId}/permissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(permission),
      });
      if (!response.ok) {
        throw new Error('Failed to add permission to role');
      }
      const data = await response.json();
      setRoles((prev) =>
        prev.map((role) =>
          role.roleID === roleId
            ? { ...role, permissions: [...role.permissions.filter((p) => p.name !== permission.name), data.data] }
            : role
        )
      );
    } catch (err) {
      setRoles(previousRoles);
      setError(err.message);
    }
  };

  // Xóa permission khỏi role
  const deletePermissionInDB = async (roleId, permissionName) => {
    setError(null);
    const previousRoles = [...roles];
    setRoles((prev) =>
      prev.map((role) =>
        role.roleID === roleId
          ? { ...role, permissions: role.permissions.filter((perm) => perm.name !== permissionName) }
          : role
      )
    );

    try {
      const response = await fetch(`http://localhost:8080/api/roles/${roleId}/permissions/${permissionName}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete permission');
      }
    } catch (err) {
      setRoles(previousRoles);
      setError(err.message);
    }
  };

  // Tạo permission mới
  const createPermission = async (permission) => {
    setError(null);
    const previousPermissions = [...permissions];
    setPermissions((prev) => [...prev, permission]);

    try {
      const response = await fetch('http://localhost:8080/api/permissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(permission),
      });
      if (!response.ok) {
        throw new Error('Failed to create permission');
      }
      await fetchPermission(); 
    } catch (err) {
      setPermissions(previousPermissions);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchRole();
    fetchPermission();
  }, []);

  const openPopup = (type, roleId = null) => {
    setPopupType(type);
    setSelectedRoleId(roleId);
    setNewPermission({ name: '', description: '' });
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupType(null);
    setSelectedRoleId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPermission((prev) => ({ ...prev, [name]: value }));
    if (name === 'name' && popupType === 'addPermissionToRole') {
      const selectedPerm = permissions.find((perm) => perm.name === value);
      setNewPermission((prev) => ({
        ...prev,
        description: selectedPerm ? selectedPerm.description : '',
      }));
    }
  };

  const handleAddPermission = async () => {
    if (!newPermission.name.trim()) return;
    setIsSubmitting(true);
    if (popupType === 'addPermissionToRole') {
      await addPermissionToDB(selectedRoleId, { ...newPermission });
    } else if (popupType === 'createPermission') {
      await createPermission({ ...newPermission });
    }
    setIsSubmitting(false);
    closePopup();
  };

  const handleDeletePermission = async (roleId, permissionName) => {
    setIsSubmitting(true);
    await deletePermissionInDB(roleId, permissionName);
    setIsSubmitting(false);
  };

  const selectedRole = roles.find((role) => role.roleID === selectedRoleId);

  return (
    <section className="p-6 space-y-6 overflow-y-auto">
      <h1 className="font-bold text-lg mb-4 select-none">Role & Permission Management</h1>
      <nav className="flex space-x-4 mb-6">
        {['Roles', 'Permissions'].map((tab) => (
          <span
            key={tab}
            className={`cursor-pointer pb-2 text-sm font-semibold ${
              activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </span>
        ))}
      </nav>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {activeTab === 'Roles' && (
        <div>
          {roles.length > 0 ? (
            roles.map((role) => (
              <div key={role.roleID} className="bg-white rounded-xl p-6 mb-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-sm text-gray-800">{role.name}</h2>
                  <button
                    onClick={() => openPopup('addPermissionToRole', role.roleID)}
                    className="text-xs bg-blue-600 text-white rounded-full px-3 py-1 hover:bg-blue-700 disabled:bg-blue-400"
                    disabled={isSubmitting}
                  >
                    Add Permission
                  </button>
                </div>
                {role.permissions.length > 0 ? (
                  <table className="w-full text-left text-xs text-gray-700 border-separate border-spacing-y-2">
                    <thead>
                      <tr className="text-gray-500 font-semibold select-none">
                        <th className="pl-4 py-2">Permission Name</th>
                        <th className="py-2">Description</th>
                        <th className="pr-4 py-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {role.permissions.map((permission) => (
                        <tr key={permission.name} className="bg-[#f9fafb] rounded-lg">
                          <td className="pl-4 py-3">{permission.name}</td>
                          <td className="py-3">{permission.description}</td>
                          <td className="pr-4 py-3 text-right">
                            <button
                              onClick={() => handleDeletePermission(role.roleID, permission.name)}
                              className="text-gray-600 hover:text-red-600 disabled:text-gray-400"
                              title="Delete"
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
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500 text-sm">No permissions assigned to this role.</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No roles available.</p>
          )}
        </div>
      )}

      {activeTab === 'Permissions' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-sm text-gray-800">Permissions</h2>
            <button
              onClick={() => openPopup('createPermission')}
              className="text-xs bg-blue-600 text-white rounded-full px-3 py-1 hover:bg-blue-700 disabled:bg-blue-400"
              disabled={isSubmitting}
            >
              Create Permission
            </button>
          </div>
          {permissions.length > 0 ? (
            <table className="w-full text-left text-xs text-gray-700 border-separate border-spacing-y-2">
              <thead>
                <tr className="text-gray-500 font-semibold select-none">
                  <th className="pl-4 py-2">Permission Name</th>
                  <th className="py-2">Description</th>
                </tr>
              </thead>
              <tbody>
                {permissions.map((permission) => (
                  <tr key={permission.name} className="bg-[#f9fafb] rounded-lg">
                    <td className="pl-4 py-3">{permission.name}</td>
                    <td className="py-3">{permission.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-sm">No permissions available.</p>
          )}
        </div>
      )}

      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h3 className="font-bold text-sm mb-4 select-none">
              {popupType === 'addPermissionToRole' ? 'Add Permission to Role' : 'Create Permission'}
            </h3>
            {popupType === 'addPermissionToRole' && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-600 text-xs mb-1">Role Name</label>
                  <input
                    type="text"
                    value={selectedRole ? selectedRole.name : ''}
                    className="w-full p-2 bg-gray-100 border border-gray-200 rounded-md text-sm"
                    disabled
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-600 text-xs mb-1">Permission Name</label>
                  <select
                    name="name"
                    value={newPermission.name}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-100 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    disabled={isSubmitting}
                  >
                    <option value="">Select a permission</option>
                    {permissions.map((perm) => (
                      <option key={perm.name} value={perm.name}>
                        {perm.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-600 text-xs mb-1">Description</label>
                  <input
                    type="text"
                    name="description"
                    value={newPermission.description}
                    className="w-full p-2 bg-gray-100 border border-gray-200 rounded-md text-sm"
                    disabled
                  />
                </div>
              </>
            )}
            {popupType === 'createPermission' && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-600 text-xs mb-1">Permission Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newPermission.name}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-100 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter permission name"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-600 text-xs mb-1">Description</label>
                  <input
                    type="text"
                    name="description"
                    value={newPermission.description}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-100 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter description"
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
                onClick={handleAddPermission}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center disabled:bg-blue-400"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
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
                ) : null}
                {isSubmitting ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default RolePage;
