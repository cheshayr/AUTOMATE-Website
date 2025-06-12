import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import './UserManagement.css';

const roles = [
  { name: 'Mechanic', icon: '🛠️' },
  { name: 'Office Staff', icon: '💻' },
  { name: 'Guard', icon: '🧍' },
  { name: 'Helper', icon: '🧹' },
  { name: 'Driver', icon: '🚗' },
];

const UserManagement = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar role="admin" onLogout={() => {}} />
      <div className="user-management" style={{ flex: 1, padding: '1rem' }}>
        <h2>User Management</h2>
        <div className="roles-container">
          {roles.map((role, index) => (
            <button key={index} className="role-button">
              <span className="role-icon">{role.icon}</span>
              {role.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;