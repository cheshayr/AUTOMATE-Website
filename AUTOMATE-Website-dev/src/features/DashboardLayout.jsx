import React from 'react';
import './DashboardLayout.css'; // optional: for layout-specific styles
import Sidebar from '../components/sidebar/Sidebar';
import { useAuthContext } from '../context/AuthContext';

const DashboardLayout = ({ children }) => {
  const { logout } = useAuthContext();

  return (
    <div className="dashboard-layout">
      <Sidebar onLogout={logout}/>
      <div className="dashboard-content">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
