import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from './api';
import { useAuth } from './AuthProvider';
import { jwtDecode } from 'jwt-decode';

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
      if (!token) throw new Error('No token received');

      const decoded = jwtDecode(token);
      login(token, decoded);

      const primaryRole = decoded.roles.includes('ROLE_ADMIN') ? 'ADMIN' :
                         decoded.roles.includes('ROLE_ORGANIZER') ? 'ORGANIZER' : 'ATTENDEE';
      
      if (primaryRole === 'ADMIN') navigate('/admin');
      else if (primaryRole === 'ORGANIZER') navigate('/dashboard');
      else navigate('/');
    } catch (error) {
      setError(error.msg || error.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-md sm:max-w-lg transform transition-all duration-300 animate-in">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Welcome Back</h2>
        {error && (
          <div className="flex items-center p-4 mb-6 bg-red-50 border border-red-200 rounded-lg text-red-600">
            <i className="fas fa-exclamation-circle mr-2"></i>
            <p id="error-message" className="text-sm">{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <div className="relative mt-1">
              <i className="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-colors"
                required
                aria-label="Email address"
                aria-describedby={error ? "error-message" : undefined}
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative mt-1">
              <i className="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-colors"
                required
                aria-label="Password"
                aria-describedby={error ? "error-message" : undefined}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 transition-colors"
          >
            Sign In
          </button>
        </form>
        <div className="mt-6 text-center space-y-2">
          <p>
            <a href="/forgot" className="text-orange-500 hover:text-orange-600 font-medium transition-colors">
              Forgot Password?
            </a>
          </p>
          <p className="text-gray-600">
            Don’t have an account?{' '}
            <a href="/signup" className="text-orange-500 hover:text-orange-600 font-medium transition-colors">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;