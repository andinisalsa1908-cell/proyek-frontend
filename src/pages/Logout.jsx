import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/auth/authService';

const Logout = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  const navigate = useNavigate();


  // 🔹 LOGIN
  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      localStorage.removeItem('token');

      navigate('/login');

    } catch (err) {
      console.log("ERROR:", err.response?.data);
      alert(err.response?.data?.message || "Logout gagal!");
    }
  };
}

export default Logout;