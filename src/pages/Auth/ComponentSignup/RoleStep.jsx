import React from "react";
import ProgressBar from "./ProgressBar";
import BackIcon from "./BackIcon";

const RoleStep = ({ onNext, onPrev, setRole }) => {
  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    onNext();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-[800px] mx-auto p-6">
        <ProgressBar currentStep={4} />
        <div className="bg-white rounded-[6px] shadow-2xl overflow-hidden w-[800px]">
          <div className="flex items-center justify-center px-6 py-8">
            <BackIcon onClick={onPrev} />
            <h1 className="text-4xl font-bold flex items-center justify-center mb-4">
              Welcome to Management Event!
            </h1>
          </div>
          <div className="p-6 flex justify-center space-x-4">
            <section className="flex flex-col md:flex-row justify-center gap-8 max-w-5xl mx-auto">
              <article className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col items-center p-8 max-w-[320px] mx-auto">
                <img
                  alt="Illustration of a person with pink hair wearing a dark purple polka dot shirt holding a red ticket"
                  className="w-40 h-40 rounded-full"
                  height="160"
                  loading="lazy"
                  src="https://storage.googleapis.com/a1aa/image/40388b28-ddb8-4b15-d644-2791fd8b4a57.jpg"
                  width="160"
                />
                <h2 className="mt-6 font-semibold text-xl text-[#1B0B3B]">
                  Find an experience
                </h2>
                <button
                  className="mt-6 px-6 py-2 border border-gray-400 rounded-md text-[#1B0B3B] text-sm font-normal hover:bg-gray-50 transition"
                  type="button"
                  onClick={() => handleRoleSelect("attendee")}
                >
                  Tell us what you love
                </button>
              </article>
              <article className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col items-center p-8 max-w-[320px] mx-auto">
                <img
                  alt="Illustration of a person with curly black hair wearing a gray polka dot jacket holding a calendar"
                  className="w-40 h-40 rounded-full"
                  height="160"
                  loading="lazy"
                  src="https://storage.googleapis.com/a1aa/image/215f5b3b-6dbd-4d88-670b-c144d5cf1f7e.jpg"
                  width="160"
                />
                <h2 className="mt-6 font-semibold text-xl text-[#1B0B3B]">
                  Organize an event
                </h2>
                <button
                  className="mt-6 px-6 py-2 border border-gray-400 rounded-md text-[#1B0B3B] text-sm font-normal hover:bg-gray-50 transition"
                  type="button"
                  onClick={() => handleRoleSelect("organizer")}
                >
                  Plan your best event ever
                </button>
              </article>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleStep;