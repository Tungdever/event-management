import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Thêm trạng thái loading
  const navigate = useNavigate();

  const checkToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser({
            email: decoded.sub,
            userId: decoded.userId,
            roles: decoded.roles || [],
            permissions: decoded.permissions || [],
            primaryRole: getPrimaryRole(decoded.roles || []),
          });
        } else {
          localStorage.removeItem('token');
          setUser(null);
          navigate('/login');
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
      }
    } else {
      setUser(null);
    }
    setIsLoading(false); // Đặt isLoading thành false sau khi kiểm tra token
  };

  useEffect(() => {
    checkToken();
    const interval = setInterval(checkToken, 300000);
    return () => clearInterval(interval);
  }, [navigate]);

  const login = (token) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    setUser({
      email: decoded.sub,
      userId: decoded.userId,
      roles: decoded.roles || [],
      permissions: decoded.permissions || [],
      primaryRole: getPrimaryRole(decoded.roles || []),
    });
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const getPrimaryRole = (roles) => {
    if (roles.includes('ROLE_ADMIN')) return 'ADMIN';
    if (roles.includes('ROLE_ORGANIZER')) return 'ORGANIZER';
    if (roles.includes('ROLE_ATTENDEE')) return 'ATTENDEE';
    return null;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);