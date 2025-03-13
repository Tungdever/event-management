import { useState } from "react";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
  };

  return (
    <div className="bg-blue-50 flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <img
            src="https://storage.googleapis.com/a1aa/image/jPzN-bChHimieaYyfFh8lI7GNJrZqhyABgkDwDErjlc.jpg"
            alt="Rocket icon"
            className="mx-auto mb-2"
            width={40}
            height={40}
          />
          <h1 className="text-2xl font-bold">Sign Up</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="name">
              Họ và tên
            </label>
            <input
              type="text"
              id="name"
              placeholder="Họ và tên"
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              placeholder="Mật khẩu"
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Xác nhận mật khẩu"
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Đăng Ký
          </button>
        </form>
        <div className="text-center mt-6">
          <p className="text-gray-600 mb-4">Đăng ký bằng</p>
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
    </div>
  );
}
