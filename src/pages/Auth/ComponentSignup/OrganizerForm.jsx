import React, { useState } from "react";
import ProgressBar from "./ProgressBar";
import Backicon from "./BackIcon";
import Swal from 'sweetalert2';

const OrganizerForm = ({ email, userData, onComplete, onPrev }) => {
  const [formData, setFormData] = useState({
    organizerName: '',
    organizerAddress: '',
    organizerWebsite: '',
    organizerPhone: '',
    fullName: '',
    email: email,
    password: userData.password || '',
    gender: '',
    birthday: '',
    address: '',
  });
  const [openSection, setOpenSection] = useState('personal');
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

    if (!data.organizerName) newErrors.organizerName = "Please enter organizer name";
    if (!data.organizerAddress) newErrors.organizerAddress = "Please enter organizer address";
    if (!data.organizerWebsite) newErrors.organizerWebsite = "Please enter website";
    if (!data.organizerPhone) newErrors.organizerPhone = "Please enter phone number";
    else if (!/^\d{10}$/.test(data.organizerPhone)) newErrors.organizerPhone = "Phone number must be exactly 10 digits";

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const fieldErrors = validateForm({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm(formData);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        birthday: formData.birthday,
        gender: formData.gender,
        address: formData.address,
       
        organizer: {
          organizerName: formData.organizerName,
          organizerAddress: formData.organizerAddress,
          organizerWebsite: formData.organizerWebsite,
          organizerPhone: formData.organizerPhone
        }
      };
      console.log(payload)
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      
       Swal.fire ({
        icon: 'success',
        title: 'ssuccess',
        text: 'Registration successful!',
      });
      onComplete();
    } catch (error) {
     
      Swal.fire ({
        icon: 'error',
        title: 'error',
        text: 'Registration failed. Please try again.',
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-[600px] mx-auto p-6">
        <ProgressBar currentStep={5} />
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col w-[600px]">
          <div className="p-6 rounded-t">
            <h2 className="text-2xl font-bold flex items-center">
              <Backicon onClick={onPrev} />
              Organizer Information
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <button
                type="button"
                onClick={() => setOpenSection(openSection === 'personal' ? '' : 'personal')}
                className="w-full text-left font-semibold text-gray-700 flex justify-between items-center hover:bg-gray-100 p-2 rounded transition-colors duration-200"
              >
                Personal Information
                <svg
                  className={`w-5 h-5 transform ${openSection === 'personal' ? 'rotate-180' : ''} transition-transform duration-200`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openSection === 'personal' && (
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
                        value="Organizer"
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
              )}
            </div>
            <div>
              <button
                type="button"
                onClick={() => setOpenSection(openSection === 'organizer' ? '' : 'organizer')}
                className="w-full text-left font-semibold text-gray-700 flex justify-between items-center hover:bg-gray-100 p-2 rounded transition-colors duration-200"
              >
                Organizer Information
                <svg
                  className={`w-5 h-5 transform ${openSection === 'organizer' ? 'rotate-180' : ''} transition-transform duration-200`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openSection === 'organizer' && (
                <div className="mt-4 animate-slide-down">
                  <div className="-mx-3 md:flex mb-6">
                    <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                      <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="organizer-name"
                      >
                        Organizer Name
                      </label>
                      <input
                        type="text"
                        name="organizerName"
                        value={formData.organizerName}
                        onChange={handleChange}
                        placeholder="Organizer Name"
                        className={`appearance-none block w-full text-gray-700 border rounded py-3 px-4 mb-3 ${
                          errors.organizerName ? "border-red-500" : "border-gray-400"
                        }`}
                        id="organizer-name"
                        required
                        aria-label="Organizer Name"
                      />
                      {errors.organizerName && (
                        <p className="text-red-500 text-xs">{errors.organizerName}</p>
                      )}
                    </div>
                    <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                      <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="organizer-website"
                      >
                        Website
                      </label>
                      <input
                        type="url"
                        name="organizerWebsite"
                        value={formData.organizerWebsite}
                        onChange={handleChange}
                        placeholder="Website link"
                        className={`appearance-none block w-full text-gray-700 border rounded py-3 px-4 mb-3 ${
                          errors.organizerWebsite ? "border-red-500" : "border-gray-400"
                        }`}
                        id="organizer-website"
                        required
                        aria-label="Website link"
                      />
                      {errors.organizerWebsite && (
                        <p className="text-red-500 text-xs">{errors.organizerWebsite}</p>
                      )}
                    </div>
                  </div>
                  <div className="-mx-3 md:flex mb-6">
                    <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                      <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="organizer-address"
                      >
                        Organizer Address
                      </label>
                      <input
                        type="text"
                        name="organizerAddress"
                        value={formData.organizerAddress}
                        onChange={handleChange}
                        placeholder="Address"
                        className={`appearance-none block w-full text-gray-700 border rounded py-3 px-4 mb-3 ${
                          errors.organizerAddress ? "border-red-500" : "border-gray-400"
                        }`}
                        id="organizer-address"
                        required
                        aria-label="Organizer Address"
                      />
                      {errors.organizerAddress && (
                        <p className="text-red-500 text-xs">{errors.organizerAddress}</p>
                      )}
                    </div>
                    <div className="md:w-1/2 px-3">
                      <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="organizer-phone"
                      >
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="organizerPhone"
                        value={formData.organizerPhone}
                        onChange={handleChange}
                        placeholder="Phone"
                        className={`appearance-none block w-full text-gray-700 border rounded py-3 px-4 ${
                          errors.organizerPhone ? "border-red-500" : "border-gray-400"
                        }`}
                        id="organizer-phone"
                        required
                        aria-label="Phone"
                      />
                      {errors.organizerPhone && (
                        <p className="text-red-500 text-xs">{errors.organizerPhone}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-500 to-red-500 text-white p-3 rounded-lg hover:scale-105 transition-transform duration-200"
            >
              Complete Registration
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrganizerForm;