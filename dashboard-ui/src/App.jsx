// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import MainLayout from './components/layout/MainLayout';
import DashboardPage from './pages/DashboardPage';
import CustomersPage from './pages/CustomersPage';
import LeadsPage from './pages/LeadsPage';
import TasksPage from './pages/TasksPage';
import NotesPage from './pages/NotesPage';
import CustomerFormPage from './pages/CustomerFormPage';
import LeadFormPage from './pages/LeadFormPage';
import TaskFormPage from './pages/TaskFormPage';
import NoteFormPage from './pages/NoteFormPage'; // Added import for NoteFormPage
import { isAuthenticated } from './utils/jwt'; // To protect the root route
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />

        {/* Protected Routes */}
        <Route path="/" element={<MainLayout />}> {/* MainLayout handles auth check */}
          <Route index element={<Navigate to="/dashboard" replace />} /> {/* Default to dashboard */}
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="customers/new" element={<CustomerFormPage />} />
          <Route path="customers/edit/:customerId" element={<CustomerFormPage />} />
          <Route path="leads" element={<LeadsPage />} />
          <Route path="leads/new" element={<LeadFormPage />} />
          <Route path="leads/edit/:leadId" element={<LeadFormPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="tasks/new" element={<TaskFormPage />} />
          <Route path="tasks/edit/:taskId" element={<TaskFormPage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="notes/new" element={<NoteFormPage />} />
          <Route path="notes/edit/:noteId" element={<NoteFormPage />} />
        </Route>
        
        {/* Fallback for any other route - optional */}
        <Route path="*" element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
