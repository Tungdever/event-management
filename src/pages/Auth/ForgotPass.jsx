import { useState } from "react";

export default function SignUp() {
  const [timer, setTimer] = useState(60);

  const handleResend = () => {
    setTimer(60); // Reset timer về 60s
  };

  return (
    <div className="bg-blue-50 flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <div className="flex flex-col items-center">
          <img
            src="https://storage.googleapis.com/a1aa/image/C9FtTtztyC1z3UnEOkcIfDbsBx0ygwFUxilClDt65q4.jpg"
            alt="Rocket icon"
            width={40}
            height={40}
            className="mb-4"
          />
          <h1 className="text-2xl font-semibold mb-6">Sign Up</h1>
        </div>
        <form className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder={`${timer}s`}
              className="border border-gray-300 rounded-lg p-2 flex-grow"
              readOnly
            />
            <button
              type="button"
              className="bg-blue-500 text-white rounded-lg px-4 py-2"
              onClick={handleResend}
            >
              Gửi lại
            </button>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white w-full rounded-lg py-2"
          >
            Xác Nhận
          </button>
        </form>
      </div>
    </div>
  );
}
