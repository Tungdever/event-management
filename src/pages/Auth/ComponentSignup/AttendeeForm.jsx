import React, { useState } from "react";
import ProgressBar from "./ProgressBar";
import BackIcon from "./BackIcon";

const AttendeeForm = ({ email, userData, onComplete, onPrev }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: email,
    password: userData.password || '',
    gender: '',
    birthday: '',
    address: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = (data) => {
    const newErrors = {};
    if (!data.fullName) newErrors.fullName = "Please enter full name";
    else if (!/^[a-zA-Z\s]+$/.test(data.fullName)) newErrors.fullName = "Full name can only contain letters and spaces";

    if (!data.password) newErrors.password = "Please enter password";
    else if (data.password.length < 8) newErrors.password = "Password must be at least 8 characters long";

    if (!data.gender) newErrors.gender = "Please select gender";
    if (!data.birthday) newErrors.birthday = "Please enter birthday";
    if (!data.address) newErrors.address = "Please enter address";

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const fieldErrors = validateForm({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm(formData);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Lưu dữ liệu vào userData và chuyển sang bước tiếp theo
    onComplete(formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-[600px] mx-auto p-6">
        <ProgressBar currentStep={5} totalSteps={6} />
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col w-[600px]">
          <div className="p-6 rounded-t">
            <h2 className="text-2xl font-bold flex items-center">
              <BackIcon onClick={onPrev} />
              Attendee Information
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mt-4 animate-slide-down">
              <div className="-mx-3 md:flex mb-4">
                <div className="md:w-1/2 px-3">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="appearance-none block w-full text-gray-700 border border-gray-400 rounded py-3 px-4"
                    id="email"
                    aria-label="Email"
                  />
                </div>
                <div className="md:w-1/2 px-3 md:mb-0">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="role"
                  >
                    Role
                  </label>
                  <input
                    type="text"
                    name="role"
                    value="Attendee"
                    disabled
                    className="appearance-none block w-full text-gray-700 border border-gray-400 rounded py-3 px-4 mb-3"
                    id="role"
                    aria-label="Role"
                  />
                </div>
              </div>
              <div className="-mx-3 md:flex mb-4">
                <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="full-name"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`appearance-none block w-full text-gray-700 border rounded py-3 px-4 mb-3 ${
                      errors.fullName ? "border-red-500" : "border-gray-400"
                    }`}
                    id="full-name"
                    required
                    aria-label="Full Name"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-xs">{errors.fullName}</p>
                  )}
                </div>
                <div className="md:w-1/2 px-3">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="birthday"
                  >
                    Birthday
                  </label>
                  <input
                    type="date"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleChange}
                    className={`appearance-none block w-full text-gray-700 border rounded py-3 px-4 ${
                      errors.birthday ? "border-red-500" : "border-gray-400"
                    }`}
                    id="birthday"
                    required
                    aria-label="Birthday"
                  />
                  {errors.birthday && (
                    <p className="text-red-500 text-xs">{errors.birthday}</p>
                  )}
                </div>
              </div>
              <div className="-mx-3 md:flex mb-4">
                <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`appearance-none block w-full text-gray-700 border rounded py-3 px-4 mb-3 ${
                      errors.password ? "border-red-500" : "border-gray-400"
                    }`}
                    id="password"
                    disabled
                    aria-label="Password"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs">{errors.password}</p>
                  )}
                </div>
                <div className="md:w-1/2 px-3">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="gender"
                  >
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={`appearance-none block w-full text-gray-700 border rounded py-3 px-4 ${
                      errors.gender ? "border-red-500" : "border-gray-400"
                    }`}
                    id="gender"
                    required
                    aria-label="Gender"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="text-red-500 text-xs">{errors.gender}</p>
                  )}
                </div>
              </div>
              <div className="-mx-3 md:flex mb-4">
                <div className="md:w-full px-3">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="address"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Address"
                    className={`appearance-none block w-full text-gray-700 border rounded py-3 px-4 mb-3 ${
                      errors.address ? "border-red-500" : "border-gray-400"
                    }`}
                    id="address"
                    required
                    aria-label="Address"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs">{errors.address}</p>
                  )}
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-500 to-red-500 text-white p-3 rounded-lg hover:scale-105 transition-transform duration-200"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AttendeeForm;