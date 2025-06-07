import React from 'react';
import Sidebar from '../../components/sidebar/Sidebar';

const AdminLayout = ({ children, role, onLogout }) => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar role={role} onLogout={onLogout} />
      <main style={{ flex: 1, padding: '1rem', marginLeft: '64px' }}>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
