import React, { useState } from "react";

const EditProfile = ({onClose}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    country: "",
    state: "",
    city: "",
    postalCode: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow w-full max-w-6xl mx-auto my-4">
    <div className="mb-4">
      <h1 className="text-2xl font-bold text-gray-800">Edit Profile</h1>
      {/* <p className="text-sm text-gray-500">/ Pages / Profile</p> */}
    </div>
    
    <div className=" pt-4">
      
      <div className="mb-6 border-t border-gray-200">
        
        <div className="flex items-center mb-4 mt-4">
          <div className="w-20 h-20  rounded-full flex items-center justify-center">
            <img
              alt="Profile Photo"
              className="rounded-full w-20 h-20"
              src="https://storage.googleapis.com/a1aa/image/8ploDel-PzHPlUscLhz6YyYs1cQO6MvkqGQNnFuQRaI.jpg"
            />
          </div>
          <div className="ml-4">
            <p className="text-gray-600">Profile Photo</p>
            <p className="text-xs text-gray-400">Recommended image size is 40px x 40px</p>
            <div className="mt-2">
              <button className="bg-orange-500 text-white px-4 py-2 rounded-md text-[13px] mb-2">Upload</button>
              <button className="bg-gray-200 text-gray-600 px-4 py-2 rounded-md ml-2 text-[13px] mb-2">Cancel</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "First Name", name: "firstName" },
            { label: "Last Name", name: "lastName" },
            { label: "Email", name: "email", type: "email" },
            { label: "Phone", name: "phone" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-gray-400 font-light text-[14px] mb-2">{field.label}</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                type={field.type || "text"}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">
          {[
            { label: "Description", name: "description" },
           
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-gray-400 font-light text-[14px] mb-2">{field.label}</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                type={field.type || "text"}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Current Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Address", name: "address" },
            { label: "Country", name: "country", type: "select" },
            { label: "City", name: "city", type: "select" },
            
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-gray-400 font-light text-[14px] mb-2">{field.label}</label>
              {field.type === "select" ? (
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                </select>
              ) : (
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  type="text"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Permanent Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Address", name: "address" },
            { label: "Country", name: "country", type: "select" },
            { label: "City", name: "city", type: "select" },
            
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-gray-400 font-light text-[14px] mb-2">{field.label}</label>
              {field.type === "select" ? (
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                </select>
              ) : (
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  type="text"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {[
            { label: "Organizer", name: "organizer" },
           
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-gray-400 font-light text-[14px] mb-2">{field.label}</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                type={field.type || "text"}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>
      {/* <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Change Password</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Current Password", name: "currentPassword" },
            { label: "New Password", name: "newPassword" },
            { label: "Confirm Password", name: "confirmPassword" },
          ].map((field) => (
            <div key={field.name} className="relative">
              <label className="block text-gray-400 font-light text-[14px] mb-2 flex justify-start items-center">{field.label}</label>
              
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                type="password"
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
              />
             
            </div>
          ))}
        </div>
      </div> */}

      <div className="flex justify-end">
        <button className="bg-gray-200 text-gray-600 px-4 py-2 rounded-md mr-2" onClick={onClose}>Cancel</button>
        <button className="bg-orange-500 text-white px-4 py-2 rounded-md" onClick={onClose}>Save</button>
      </div>
    </div>
  </div>
  );
};

export default EditProfile;
