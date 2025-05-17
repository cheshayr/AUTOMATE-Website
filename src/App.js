import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import LoginPage from './components/LoginPage';
// import CreateAccount from './components/CreateAccount';
// import AppointmentPage from './components/AppointmentPage';
// import EmployeePage from './components/EmployeePage';
import AuthPage from './features/auth/AuthPage';
import { AuthProvider } from './context/AuthContext.jsx';
import Dashboard from './features/dashboard/Dashboard.jsx';
import AppointmentsPage from './features/appointments/AppointmentsPage.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
























