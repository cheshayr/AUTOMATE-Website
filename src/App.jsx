import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import LoginPage from './components/LoginPage';
// import CreateAccount from './components/CreateAccount';
// import AppointmentPage from './components/AppointmentPage';
// import EmployeePage from './components/EmployeePage';
import AuthPage from "./features/auth/AuthPage.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import AppointmentsPage from "./pages/appointments/AppointmentsPage.jsx";
import AppointmentDetailsPage from "./pages/appointments/AppointmentDetailsPage.jsx";
import StockManagement from "./features/stocks/StockManagement.jsx";
import Services from "./pages/services/ServiceConfigPage.jsx";
import ActivityLogs from "./activity/ActivityLogs.jsx";
import UserManagement from "./features/user/UserManagement.jsx";
import EditServicePage from "./pages/services/EditServicePage.jsx";
import LoginPage from "./pages/auth/Login.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAlert } from "./hooks/useAlert.jsx";

function App() {
  return (
    <Router>
      <QueryClientProvider client={new QueryClient()}>
        <AuthProvider>
          <Routes>
            {/* <Route path="/" element={<AuthPage />} /> */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route
              path="/appointments/:id"
              element={<AppointmentDetailsPage />}
            />
            <Route path="/inventory" element={<StockManagement />} />
            <Route path="/user" element={<UserManagement />} />
            <Route path="/services" element={<Services />} />
            <Route path="/activities" element={<ActivityLogs />} />
            <Route path="/services" element={<Services />} />
            <Route
              path="/services/edit/:serviceName"
              element={<EditServicePage />}
            />
          </Routes>
        </AuthProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
