import React from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import './AdminLayout.css';

const AdminLayout = ({ children, role, onLogout }) => {
  return (
    <div className="admin-layout">
      <Sidebar role={role} onLogout={onLogout} />
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
