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
            <label className="block text-gray-700 mb-2 text-gray-400">Tên đăng nhập</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-gray-400">Mật khẩu</label>
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
              <label className="text-gray-700">Lưu đăng nhập</label>
            </div>
            <a href="#" className="text-blue-500">
              Quên mật khẩu ?
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            onClick={() => navigate("/")}
          >
            Log In
          </button>
        </form>
        <div className="text-center mt-6">
          <a href="#" className="text-blue-500">
            
          </a>
          <button
            type="submit"
            className="w-full  text-blue-500 py-2 rounded-lg hover:bg-blue-100"
            onClick={() => navigate("/signup")}
          >
            Tạo tài khoản
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
