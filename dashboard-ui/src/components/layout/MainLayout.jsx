// src/components/layout/MainLayout.jsx
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar'; // To be created
import { isAuthenticated } from '../../utils/jwt'; // To check auth status

const MainLayout = () => {
  if (!isAuthenticated()) {
    // If not authenticated, redirect to login page
    // Pass along the current location so user can be redirected back after login
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <Outlet /> {/* Child routes will render here */}
      </main>
    </div>
  );
};

export default MainLayout;
