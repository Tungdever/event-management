import React, { useState } from "react";
import ProgressBar from "./ProgressBar";
import BackIcon from "./BackIcon";

const VerificationStep = ({ email, verificationCode, onNext, onPrev }) => {
  const [code, setCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (code.length !== 6) {
      alert('Please enter a valid 6-digit code');
      return;
    }

    if (code === verificationCode) {
      onNext();
    } else {
      alert('Invalid verification code');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md mx-auto p-6">
        <ProgressBar currentStep={2} />
        <div className="bg-white rounded-[6px] shadow-2xl overflow-hidden w-[450px]">
          <h1 className="text-xl font-bold text-orange-500 mt-2 px-6 py-2 hover:cursor-pointer">
            Management Event
          </h1>
          <div className="px-6 pt-6 pb-4">
            <BackIcon onClick={onPrev} />
            <h2 className="text-3xl font-bold flex items-center mb-4">
              Check your email for a code
            </h2>
            <span className="text-[13px] text-gray-500">
              Check your inbox and enter the code we have sent you
            </span>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <input
              type="email"
              value={email}
              disabled
              className="w-full p-3 border rounded-lg bg-gray-100 text-gray-900"
              aria-label="Email"
            />
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter code"
              maxLength="6"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              required
              aria-label="Verification Code"
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-400 to-orange-400 text-white p-3 rounded-lg hover:scale-105 transition-transform duration-200"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerificationStep;