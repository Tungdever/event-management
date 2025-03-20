import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ username, password, remember });
  };

  return (
    <div className="bg-blue-50 flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <img
            src="https://storage.googleapis.com/a1aa/image/_UD6-_cTdohxbPOifwyftcUPTjOfrhsBwBwmNVU5o4Q.jpg"
            alt="Rocket icon"
            className="mr-2"
            width="24"
            height="24"
          />
          <h1 className="text-3xl font-bold text-orange-500">Log In</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-gray-400 text-[14px]">Tên đăng nhập</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-gray-400 text-[14px]">Mật khẩu</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={remember}
                onChange={() => setRemember(!remember)}
              />
              <label className="text-gray-700 text-[14px]">Lưu đăng nhập</label>
            </div>
            <a href="/forgot" className="text-orange-500 text-[14px]" >
              Quên mật khẩu ?
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-gray-200 text-orange-400  font-medium text-[17px] py-2 rounded-lg hover:bg-gray-400 hover:text-orange-300"
            onClick={() => navigate("/")}
          >
            Log In
          </button>
        </form>
        <div className=" flex justify-end items-center text-center mt-4 space-x-2">
          <p  className="text-gray-500 text-[13px]">
           Bạn chưa có tài khoản ? 
          </p>
          <button
            type="submit"
            className=" text-orange-500 py-2 rounded-lg  text-[14px] hover:text-orange-200"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </div>
        <div className="flex items-center justify-center mt-4 relative">
          <hr className="w-full border-gray-300 mb-2" />
          <span className="absolute bg-white px-2 text-gray-500 mb-4">or</span>
        </div>
        <div className="flex justify-center space-x-4">
            <a href="#" className="text-red-500 text-2xl">
              <i className="fab fa-google"></i>
            </a>
            <a href="#" className="text-blue-600 text-2xl">
              <i className="fab fa-facebook"></i>
            </a>
        </div>
      </div>
    </div>
  );
}
