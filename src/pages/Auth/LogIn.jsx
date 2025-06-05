import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from './api';
import { useAuth } from './AuthProvider';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.login(email, password);
      const token = response.data;
      if (!token) throw new Error('Không nhận được token');

      const decoded = jwtDecode(token);
      login(token, decoded);

      // Kiểm tra redirectEventId trong localStorage
      const redirectEventId = localStorage.getItem('redirectEventId');
      if (redirectEventId) {
        // Chuyển hướng về trang chi tiết sự kiện
        navigate(`/event/${redirectEventId}`);
        // Xóa redirectEventId sau khi sử dụng
        localStorage.removeItem('redirectEventId');
      } else {
        // Chuyển hướng mặc định dựa trên vai trò
        const primaryRole = decoded.roles.includes('ROLE_ADMIN') ? 'ADMIN' :
                           decoded.roles.includes('ROLE_ORGANIZER') ? 'ORGANIZER' : 'ATTENDEE';
        if (primaryRole === 'ADMIN') navigate('/admin');
        else if (primaryRole === 'ORGANIZER') navigate('/dashboard');
        else navigate('/');
      }
    } catch (error) {
      if (error.response?.status === 403) {
        Swal.fire({
          icon: 'warning',
          title: 'Tài khoản bị khóa',
          text: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên để được hỗ trợ.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi đăng nhập',
          text: error.msg || error.message || 'Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.',
        });
      }
      setError(error.msg || error.message || 'Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-10 transition-all duration-300 transform bg-white shadow-md rounded-xl sm:max-w-lg animate-in">
        <h2 className="mb-6 text-3xl font-bold text-center text-gray-800">Welcome Back</h2>
        {error && (
          <div className="flex items-center p-4 mb-6 text-red-600 border border-red-200 rounded-lg bg-red-50">
            <i className="mr-2 fas fa-exclamation-circle"></i>
            <p id="error-message" className="text-sm">{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <div className="relative mt-1">
              <i className="absolute text-gray-400 transform -translate-y-1/2 fas fa-envelope left-3 top-1/2"></i>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full py-3 pl-10 pr-3 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
                required
                aria-label="Email"
                aria-describedby={error ? "error-message" : undefined}
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative mt-1">
              <i className="absolute text-gray-400 transform -translate-y-1/2 fas fa-lock left-3 top-1/2"></i>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full py-3 pl-10 pr-3 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
                required
                aria-label="Password"
                aria-describedby={error ? "error-message" : undefined}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 font-medium text-white transition-colors bg-orange-500 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2"
          >
            Log In
          </button>
        </form>
        <div className="mt-6 space-y-2 text-center">
          <p>
            <a href="/forgot" className="font-medium text-orange-500 transition-colors hover:text-orange-600">
              Forgot Password?
            </a>
          </p>
          <p className="text-gray-600">
            Don’t have an account?{' '}
            <a href="/signup" className="font-medium text-orange-500 transition-colors hover:text-orange-600">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;