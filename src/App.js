import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import CreateAccount from './components/CreateAccount';
import AdminDashboard from './components/AdminDashboard';
import StaffDashboard from './components/StaffDashboard';
import AppointmentPage from './components/AppointmentPage';
import EmployeePage from './components/EmployeePage';

function App() {
  const [showSignup, setShowSignup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');
  const [user, setUser] = useState({ firstName: '' });

  const handleLoginSuccess = (userRole) => {
    setRole(userRole);
    setIsLoggedIn(true);
    const fullName = localStorage.getItem('fullName') || 'User';
    const firstName = fullName.split(' ')[0];
    setUser({ firstName });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setRole('');
    setUser({ firstName: '' });
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              role === 'Admin' ? (
                <AdminDashboard user={user} onLogout={handleLogout} />
              ) : (
                <StaffDashboard user={user} onLogout={handleLogout} />
              )
            ) : showSignup ? (
              <CreateAccount
                onBackClick={() => setShowSignup(false)}
                onAccountCreated={() => setShowSignup(false)}
              />
            ) : (
              <LoginPage
                onLoginSuccess={handleLoginSuccess}
                onSignupClick={() => setShowSignup(true)}
              />
            )
          }
        />

        <Route
          path="/appointments"
          element={
            isLoggedIn && role === 'Staff' ? (
              <AppointmentPage />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/employees"
          element={
            isLoggedIn && role === 'Admin' ? (
              <EmployeePage user={user} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
























