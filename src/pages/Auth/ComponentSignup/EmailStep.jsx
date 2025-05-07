import React, { useState } from "react";
import ProgressBar from "./ProgressBar";

const EmailStep = ({ onNext, setEmail }) => {
  const [inputEmail, setInputEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:8080/api/auth/send-verification-code/${inputEmail}`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.code || 'Unable to send verification code');
      }

      const data = await response.text();
      setEmail(inputEmail);
      alert(`Verification code sent to ${inputEmail}`);
      onNext(data);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md mx-auto p-6">
        <ProgressBar currentStep={1} />
        <div className="bg-white rounded-[6px] shadow-2xl overflow-hidden h-[400px] w-[450px]">
          <h1 className="text-xl font-bold text-orange-500 mt-2 px-6 py-2 hover:cursor-pointer">
            Management Event
          </h1>
          <div className="to-red-400 p-6 mb-4">
            <h2 className="text-3xl font-bold">Welcome!</h2>
            <h2 className="text-3xl font-bold">What's your email?</h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-10">
            <input
              type="email"
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              required
              aria-label="Email"
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-400 to-red-400 text-white p-3 rounded-[6px] hover:scale-105 transition-transform duration-200"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmailStep;