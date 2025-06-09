import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
// import ProtectedRoute from './components/ProtectedRoute'; // If using the component

function App() {
  // Simple check for token to redirect from root
  const token = localStorage.getItem('token');

  return (
    <Router>
      {/* Basic Nav (can be improved) */}
      <nav className="bg-gray-100 p-4 mb-4 shadow">
        <ul className="flex space-x-4">
          <li><Link to="/login" className="text-blue-500 hover:text-blue-700">Login</Link></li>
          <li><Link to="/register" className="text-blue-500 hover:text-blue-700">Register</Link></li>
          <li><Link to="/dashboard" className="text-blue-500 hover:text-blue-700">Dashboard (Protected)</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Example of using ProtectedRoute component:
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
        */}
        {/* For simplicity now, DashboardPage handles its own protection logic */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Add other routes here */}
        <Route path="*" element={<Navigate to="/" />} /> {/* Fallback route */}
      </Routes>
    </Router>
  );
}

export default App;
