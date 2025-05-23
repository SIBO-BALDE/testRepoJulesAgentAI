// src/components/layout/Sidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
// import { removeAuthToken } from '../../utils/jwt'; // Handled by authService.logout
import { logout } from '../../services/authService'; // Use the authService
// Consider adding icons later e.g. from react-icons

const navItems = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Customers', path: '/customers' },
  { name: 'Leads', path: '/leads' },
  { name: 'Tasks', path: '/tasks' },
  { name: 'Notes', path: '/notes' },
];

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // authService.logout calls removeAuthToken()
    navigate('/login');
  };

  const baseLinkClasses = "block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700 hover:text-white";
  const activeLinkClasses = "bg-blue-700 text-white"; // Applied by NavLink's isActive prop

  return (
    <aside className="w-64 bg-blue-800 text-blue-100 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-white">My App</h1>
      </div>
      <nav className="flex-grow">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `${baseLinkClasses} ${isActive ? activeLinkClasses : ''}`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="p-6">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
