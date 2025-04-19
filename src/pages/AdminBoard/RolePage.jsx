import React, { useState,useEffect } from 'react';

const RolePage = () => {
  // Initial data from JSON
  const [roles, setRoles] = useState([]);
  const token = localStorage.getItem("token");
  // State for popup visibility and form data
  const [showPopup, setShowPopup] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [newPermission, setNewPermission] = useState({ name: '', description: '' });

  // Open popup for adding permission
  const openPopup = (roleId) => {
    setSelectedRoleId(roleId);
    setNewPermission({ name: '', description: '' });
    setShowPopup(true);
  };

  // Close popup
  const closePopup = () => {
    setShowPopup(false);
    setSelectedRoleId(null);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPermission((prev) => ({ ...prev, [name]: value }));
  };

  // Add new permission
  const addPermission = () => {
    if (newPermission.name.trim() && newPermission.description.trim()) {
      setRoles((prevRoles) =>
        prevRoles.map((role) =>
          role.roleID === selectedRoleId
            ? {
                ...role,
                permissions: [...role.permissions, { ...newPermission }],
              }
            : role
        )
      );
      closePopup();
    }
  };

  // Delete permission
  const deletePermission = (roleId, permissionName) => {
    setRoles((prevRoles) =>
      prevRoles.map((role) =>
        role.roleID === roleId
          ? {
              ...role,
              permissions: role.permissions.filter((perm) => perm.name !== permissionName),
            }
          : role
      )
    );
  };
  const fetchPermission = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/roles", {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      setRoles(data.data)
    } catch (error) {
      
      console.error("Error fetching events:", error);
    } finally {
     
    }
  };
  const deletePermissionInDB = async(permissionId) =>{
    try{
      const response = await fetch(`http://localhost:8080/api/permissions/${permissionId}`,{
        headers: {Authorization : `Bearer ${token}`},
        method:"DELETE",
      })
      if(!response.ok){
        throw new Error("Delete permission false")
      }
      
    }catch(error){
      console.error("Error delete per:", error);
    }
  }
  const addPermissionToDB = async(roleId) =>{
    try{
      const response = await fetch(`http://localhost:8080/api/${roleId}/permissions`,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
      },
      method:"POST",
      body:newPermission
      })
      if(!response.ok){
        throw new Error("Delete permission false")
      }else{
        alert(response.msg)
      }
    }catch(error){
      console.error("Error add per:", error);
    }
  }
  useEffect(() => {
    fetchPermission();
  }, []);
  return (
    <section className="p-6 space-y-6 overflow-y-auto">
      <h1 className="font-bold text-lg mb-4 select-none">Role Management</h1>
      {roles.map((role) => (
        <div key={role.roleID} className="bg-white rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-sm text-gray-800">{role.name}</h2>
            <button
              onClick={() => openPopup(role.roleID)}
              className="text-xs bg-blue-600 text-white rounded-full px-3 py-1 hover:bg-blue-700"
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
                        onClick={() => deletePermission(role.roleID, permission.name)}
                        className="text-gray-600 hover:text-red-600"
                        title="Delete"
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
      ))}

      {/* Popup for adding permission */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h3 className="font-bold text-sm mb-4 select-none">Add Permission</h3>
            <div className="mb-4">
              <label className="block text-gray-600 text-xs mb-1">Permission Name</label>
              <input
                type="text"
                name="name"
                value={newPermission.name}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-100 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter permission name"
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
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={closePopup}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={addPermission}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default RolePage;