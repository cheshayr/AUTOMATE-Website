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
import AppointmentDetailsPage from './features/appointments/AppointmentDetailsPage.jsx';
import StockManagement from './features/stocks/StockManagement.jsx';
import Notifications from './features/notifications/Notifications.jsx';
import Services from './features/services/Services.jsx';
import Activity from './features/activity/Activity.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/appointments/:id" element={<AppointmentDetailsPage />} />
          <Route path="/inventory" element={<StockManagement />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/services" element={<Services />} />
          <Route path="/activities" element={<Activity />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;



























