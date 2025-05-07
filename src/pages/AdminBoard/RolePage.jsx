import React, { useState, useEffect } from 'react';

const RolePage = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [selectedPermissionName, setSelectedPermissionName] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', permissions: [] });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('Roles');
  const token = localStorage.getItem('token');

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

  // Lấy danh sách permissions
  const fetchPermissions = async () => {
    try {
      setError(null);
      if (!token) throw new Error('No token found');
      const response = await fetch('http://localhost:8080/api/permissions', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch permissions');
      const data = await response.json();
      setPermissions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      setPermissions([]);
    }
  };

  // Tạo role mới
  const createRole = async (roleData) => {
    try {
      setError(null);
      const response = await fetch('http://localhost:8080/api/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(roleData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create role');
      }
      await fetchRoles();
    } catch (err) {
      throw err;
    }
  };

  // Cập nhật role
  const updateRole = async (roleData) => {
    try {
      setError(null);
      const response = await fetch('http://localhost:8080/api/roles/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(roleData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update role');
      }
      await fetchRoles();
    } catch (err) {
      throw err;
    }
  };

  // Xóa role
  const deleteRole = async (roleName) => {
    try {
      setError(null);
      const response = await fetch(`http://localhost:8080/api/roles/delete/${roleName}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete role');
      }
      await fetchRoles();
    } catch (err) {
      throw err;
    }
  };

  // Tạo permission mới
  const createPermission = async (permissionData) => {
    try {
      setError(null);
      const response = await fetch('http://localhost:8080/api/permissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(permissionData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create permission');
      }
      await fetchPermissions();
    } catch (err) {
      throw err;
    }
  };

  // Cập nhật permission
  const updatePermission = async (permissionData) => {
    try {
      setError(null);
      const response = await fetch('http://localhost:8080/api/permissions/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(permissionData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update permission');
      }
      await fetchPermissions();
    } catch (err) {
      throw err;
    }
  };

  // Xóa permission
  const deletePermission = async (permissionName) => {
    try {
      setError(null);
      const response = await fetch(`http://localhost:8080/api/permissions/delete/${permissionName}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete permission');
      }
      await fetchPermissions();
      await fetchRoles(); // Cập nhật roles để phản ánh thay đổi permissions
    } catch (err) {
      throw err;
    }
  };

  // Gán permissions cho role
  const assignPermissionsToRole = async (roleId, permissionNames) => {
    try {
      setError(null);
      const response = await fetch(`http://localhost:8080/api/roles/${roleId}/permissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(permissionNames),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to assign permissions');
      }
      await fetchRoles();
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const openPopup = (type, roleId = null, roleData = null, permissionName = null) => {
    setPopupType(type);
    setSelectedRoleId(roleId);
    setSelectedPermissionName(permissionName);
    if (type === 'editRole' && roleData) {
      setFormData({
        roleID: roleData.roleID,
        name: roleData.name,
        permissions: roleData.permissions.map((p) => p.name),
      });
    } else if (type === 'editPermission' && permissionName) {
      const permission = permissions.find((p) => p.name === permissionName);
      setFormData({
        name: permission.name,
        description: permission.description,
      });
    } else {
      setFormData({ name: '', description: '', permissions: [] });
    }
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupType(null);
    setSelectedRoleId(null);
    setSelectedPermissionName(null);
    setFormData({ name: '', description: '', permissions: [] });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePermissionToggle = (permissionName) => {
    setFormData((prev) => {
      const permissions = prev.permissions.includes(permissionName)
        ? prev.permissions.filter((p) => p !== permissionName)
        : [...prev.permissions, permissionName];
      return { ...prev, permissions };
    });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() && popupType !== 'assignPermissions') return;
    setIsSubmitting(true);
    try {
      if (popupType === 'createRole') {
        await createRole({ name: formData.name });
      } else if (popupType === 'editRole') {
        await updateRole({
          roleID: formData.roleID,
          name: formData.name,
          permissions: formData.permissions.map((name) => ({
            name,
            description: permissions.find((p) => p.name === name)?.description || '',
          })),
        });
      } else if (popupType === 'deleteRole') {
        await deleteRole(formData.name);
      } else if (popupType === 'createPermission') {
        await createPermission({ name: formData.name, description: formData.description });
      } else if (popupType === 'editPermission') {
        await updatePermission({ name: formData.name, description: formData.description });
      } else if (popupType === 'deletePermission') {
        await deletePermission(formData.name);
      } else if (popupType === 'assignPermissions') {
        await assignPermissionsToRole(selectedRoleId, formData.permissions);
      }
      closePopup();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-sm text-gray-800">Roles</h2>
            <button
              onClick={() => openPopup('createRole')}
              className="text-xs bg-blue-600 text-white rounded-full px-3 py-1 hover:bg-blue-700 disabled:bg-blue-400"
              disabled={isSubmitting}
            >
              Create Role
            </button>
          </div>
          {roles.length > 0 ? (
            roles.map((role) => (
              <div key={role.roleID} className="bg-white rounded-xl p-6 mb-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-sm text-gray-800">{role.name}</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openPopup('editRole', role.roleID, role)}
                      className="text-xs bg-yellow-500 text-white rounded-full px-3 py-1 hover:bg-yellow-600 disabled:bg-yellow-400"
                      disabled={isSubmitting}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openPopup('deleteRole', role.roleID, { name: role.name })}
                      className="text-xs bg-red-600 text-white rounded-full px-3 py-1 hover:bg-red-700 disabled:bg-red-400"
                      disabled={isSubmitting}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => openPopup('assignPermissions', role.roleID)}
                      className="text-xs bg-blue-600 text-white rounded-full px-3 py-1 hover:bg-blue-700 disabled:bg-blue-400"
                      disabled={isSubmitting}
                    >
                      Assign Permissions
                    </button>
                  </div>
                </div>
                {role.permissions.length > 0 ? (
                  <table className="w-full text-left text-xs text-gray-700 border-separate border-spacing-y-2">
                    <thead>
                      <tr className="text-gray-500 font-semibold select-none">
                        <th className="pl-4 py-2">Permission Name</th>
                        <th className="py-2">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {role.permissions.map((permission) => (
                        <tr key={permission.name} className="bg-[#f9fafb] rounded-lg">
                          <td className="pl-4 py-3">{permission.name}</td>
                          <td className="py-3">{permission.description}</td>
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
                  <th className="pr-4 py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {permissions.map((permission) => (
                  <tr key={permission.name} className="bg-[#f9fafb] rounded-lg">
                    <td className="pl-4 py-3">{permission.name}</td>
                    <td className="py-3">{permission.description}</td>
                    <td className="pr-4 py-3 text-right flex gap-2 justify-end">
                      <button
                        onClick={() => openPopup('editPermission', null, null, permission.name)}
                        className="text-gray-600 hover:text-yellow-600 disabled:text-gray-400"
                        title="Edit"
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
                        onClick={() => openPopup('deletePermission', null, { name: permission.name })}
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
            <p className="text-gray-500 text-sm">No permissions available.</p>
          )}
        </div>
      )}

      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h3 className="font-bold text-sm mb-4 select-none">
              {popupType === 'createRole' && 'Create Role'}
              {popupType === 'editRole' && 'Edit Role'}
              {popupType === 'deleteRole' && 'Delete Role'}
              {popupType === 'createPermission' && 'Create Permission'}
              {popupType === 'editPermission' && 'Edit Permission'}
              {popupType === 'deletePermission' && 'Delete Permission'}
              {popupType === 'assignPermissions' && 'Assign Permissions to Role'}
            </h3>
            {(popupType === 'createRole' || popupType === 'editRole') && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-600 text-xs mb-1">Role Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-100 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter role name"
                    disabled={isSubmitting}
                  />
                </div>
                {popupType === 'editRole' && (
                  <div className="mb-4">
                    <label className="block text-gray-600 text-xs mb-1">Permissions</label>
                    <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md p-2">
                      {permissions.map((perm) => (
                        <div key={perm.name} className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            checked={formData.permissions.includes(perm.name)}
                            onChange={() => handlePermissionToggle(perm.name)}
                            className="mr-2"
                            disabled={isSubmitting}
                          />
                          <span className="text-sm">{perm.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
            {(popupType === 'createPermission' || popupType === 'editPermission') && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-600 text-xs mb-1">Permission Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-100 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter permission name"
                    disabled={isSubmitting || popupType === 'editPermission'}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-600 text-xs mb-1">Description</label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-100 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter description"
                    disabled={isSubmitting}
                  />
                </div>
              </>
            )}
            {(popupType === 'deleteRole' || popupType === 'deletePermission') && (
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to delete{' '}
                <span className="font-semibold">{formData.name}</span>?
              </p>
            )}
            {popupType === 'assignPermissions' && (
              <div className="mb-4">
                <label className="block text-gray-600 text-xs mb-1">Role Name</label>
                <input
                  type="text"
                  value={selectedRole ? selectedRole.name : ''}
                  className="w-full p-2 bg-gray-100 border border-gray-200 rounded-md text-sm"
                  disabled
                />
                <label className="block text-gray-600 text-xs mt-4 mb-1">Select Permissions</label>
                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md p-2">
                  {permissions.map((perm) => (
                    <div key={perm.name} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(perm.name)}
                        onChange={() => handlePermissionToggle(perm.name)}
                        className="mr-2"
                        disabled={isSubmitting}
                      />
                      <span className="text-sm">{perm.name}</span>
                    </div>
                  ))}
                </div>
              </div>
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
                )}
                {isSubmitting
                  ? 'Submitting...'
                  : popupType === 'deleteRole' || popupType === 'deletePermission'
                  ? 'Delete'
                  : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default RolePage;