import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useAuth } from "../Auth/AuthProvider";

const uploadFilesToCloudinary = async (files) => {
  if (!files || (Array.isArray(files) && files.length === 0)) return [];

  const uploadPromises = files.map(async (file) => {
    try {
      if (typeof file === "string" && file.startsWith("http")) {
        return file;
      }

      if (!(file instanceof File)) {
        Swal.fire({
          icon: "warning",
          title: "Warning",
          text: "Invalid file!",
        });
        return null;
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:8080/api/storage/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${errorText}`);
      }

      const publicId = await response.text();
      if (!publicId) throw new Error("No public_id received");
      return publicId;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Error uploading file: ${error.message}`,
      });
      return null;
    }
  });

  const results = await Promise.all(uploadPromises);
  return results.filter((id) => id !== null);
};

const EditProfile = ({ onClose, userData, onUpdate }) => {
  const { user } = useAuth();
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    userId: userData?.userId || 2,
    fullName: userData?.fullName || "",
    email: userData?.email || "",
    gender: userData?.gender || "",
    birthday: userData?.birthday ? new Date(userData.birthday).toISOString().split("T")[0] : "",
    address: userData?.address || "",
    organizer: {
      organizerName: userData?.organizer?.organizerName || "",
      organizerLogo: userData?.organizer?.organizerLogo || "",
      organizerAddress: userData?.organizer?.organizerAddress || "",
      organizerWebsite: userData?.organizer?.organizerWebsite || "",
      organizerPhone: userData?.organizer?.organizerPhone || "",
      organizerDesc: userData?.organizer?.organizerDesc || "",
    },
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(
    userData?.organizer?.organizerLogo
      ? userData.organizer.organizerLogo.startsWith("http")
        ? userData.organizer.organizerLogo
        : `https://res.cloudinary.com/dho1vjupv/image/upload/${userData.organizer.organizerLogo}`
      : "https://i.pinimg.com/736x/cd/4b/d9/cd4bd9b0ea2807611ba3a67c331bff0b.jpg"
  );
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("organizer.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        organizer: { ...prev.organizer, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (user?.primaryRoles?.includes("ORGANIZER")) {
      if (!formData.organizer.organizerName.trim())
        newErrors.organizerName = "Organizer name is required";
      if (formData.organizer.organizerWebsite && !/^https?:\/\/.*/.test(formData.organizer.organizerWebsite))
        newErrors.organizerWebsite = "Website must start with http:// or https://";
      if (formData.organizer.organizerPhone && !/^\d{10,15}$/.test(formData.organizer.organizerPhone))
        newErrors.organizerPhone = "Phone number must be 10-15 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      let organizerLogo = formData.organizer.organizerLogo;
      if (logoFile && user?.primaryRoles?.includes("ORGANIZER")) {
        const uploadedIds = await uploadFilesToCloudinary([logoFile]);
        if (uploadedIds.length > 0) {
          organizerLogo = uploadedIds[0];
        } else {
          throw new Error("Failed to upload logo");
        }
      }

      const updatedData = {
        ...formData,
        organizer: user?.primaryRoles?.includes("ORGANIZER") ? {
          ...formData.organizer,
          organizerLogo,
        } : null,
      };

      const response = await axios.put(
        "http://localhost:8080/api/auth/save-change",
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Profile updated successfully!",
        });
        if (onUpdate) onUpdate(response.data);
        onClose();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to update profile. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
      >
        <i className="fa-solid fa-xmark"></i>
      </button>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Edit Profile
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Birthday
            </label>
            <input
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
        </div>

        {/* Organizer Information (only for ORGANIZER role) */}
        {user?.primaryRoles?.includes("ORGANIZER") && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Organizer Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organizer Name *
                </label>
                <input
                  type="text"
                  name="organizer.organizerName"
                  value={formData.organizer.organizerName}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
                {errors.organizerName && (
                  <p className="text-red-500 text-xs mt-1">{errors.organizerName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organizer Logo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                {logoPreview && (
                  <img
                    src={logoPreview}
                    alt="Organizer Logo Preview"
                    className="mt-2 w-24 h-24 rounded-full object-cover"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organizer Address
                </label>
                <input
                  type="text"
                  name="organizer.organizerAddress"
                  value={formData.organizer.organizerAddress}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organizer Website
                </label>
                <input
                  type="url"
                  name="organizer.organizerWebsite"
                  value={formData.organizer.organizerWebsite}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
                {errors.organizerWebsite && (
                  <p className="text-red-500 text-xs mt-1">{errors.organizerWebsite}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organizer Phone
                </label>
                <input
                  type="text"
                  name="organizer.organizerPhone"
                  value={formData.organizer.organizerPhone}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
                {errors.organizerPhone && (
                  <p className="text-red-500 text-xs mt-1">{errors.organizerPhone}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organizer Description
                </label>
                <textarea
                  name="organizer.organizerDesc"
                  value={formData.organizer.organizerDesc}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  rows="4"
                />
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;