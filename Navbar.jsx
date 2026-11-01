import React from 'react';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  console.log("Navbar Rendered. Current User:", user); // <-- Yeh line check karne ke liye hai

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-900 text-white shadow-md px-6 py-4 flex justify-between items-center w-full">
      <div className="flex items-center space-x-2">
        <span className="text-2xl font-extrabold tracking-wider">DigitalBank</span>
      </div>
      
      <div className="flex items-center space-x-4">
        <span className="text-sm bg-blue-800 px-4 py-2 rounded-full font-medium shadow-inner">
           {user ? user.name : 'Guest User'}
        </span>
        <button
          onClick={handleLogout}
          className="bg-red-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition shadow"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;