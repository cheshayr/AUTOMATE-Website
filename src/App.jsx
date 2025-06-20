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
import DashboardLayout from "./features/DashboardLayout.jsx";
import { useAuthContext } from "./context/AuthContext.jsx";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuthContext();
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return <DashboardLayout>{children}</DashboardLayout>;
};

function App() {
  return (
    <Router>
      <QueryClientProvider client={new QueryClient()}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments"
              element={
                <ProtectedRoute>
                  <AppointmentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments/:id"
              element={
                <ProtectedRoute>
                  <AppointmentDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inventory"
              element={
                <ProtectedRoute>
                  <StockManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user"
              element={
                <ProtectedRoute>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services"
              element={
                <ProtectedRoute>
                  <Services />
                </ProtectedRoute>
              }
            />
            <Route
              path="/activities"
              element={
                <ProtectedRoute>
                  <ActivityLogs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/edit/:serviceName"
              element={
                <ProtectedRoute>
                  <EditServicePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
