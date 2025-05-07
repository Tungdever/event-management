import React, { useState } from "react";
import ProgressBar from "./ProgressBar";
import BackIcon from "./BackIcon";

const NameStep = ({ onNext, onPrev, setUserData, email }) => {
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validatePassword = (value) => {
    if (!value) return "Please enter a password";
    if (value.length < 8) return "Password must be at least 8 characters long";
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const passwordError = validatePassword(password);

    if (passwordError) {
      setErrors({ password: passwordError });
      return;
    }

    setErrors({});
    setUserData({ password });
    onNext();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md mx-auto p-6">
        <ProgressBar currentStep={3} />
        <div className="bg-white rounded-[6px] shadow-2xl overflow-hidden w-[450px] h-[500px]">
          <h1 className="text-xl font-bold text-orange-500 mt-2 px-6 py-2 hover:cursor-pointer">
            Management Event
          </h1>
          <div className="px-6 pt-6 pb-8">
            <h2 className="text-3xl font-bold flex items-center">
              <BackIcon onClick={onPrev} />
              Let's create your account
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="px-10 py-6 space-y-6">
            <div>
              <input
                type="email"
                value={email}
                disabled
                className="w-full p-3 border rounded-lg bg-gray-100 text-gray-900"
                aria-label="Email"
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${
                  errors.password ? "border-red-500" : ""
                }`}
                required
                aria-label="Password"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
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

export default NameStep;