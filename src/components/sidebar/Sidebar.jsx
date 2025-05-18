import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, Bell, Package, Wrench, Users, FileText, UserCircle, LogOut } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ onLogout }) => {
  const navItems = [
    { to: '/dashboard', icon: <Home size={24} />, label: 'Dashboard' },
    { to: '/appointments', icon: <Calendar size={24} />, label: 'Appointments' },
    { to: '/inventory', icon: <Package size={24} />, label: 'Inventory' },
    { to: '/notifications', icon: <Bell size={24} />, label: 'Notifications' },
    { to: '/services', icon: <Wrench size={24} />, label: 'Services' },
    { to: '/users', icon: <Users size={24} />, label: 'Users' },
    { to: '/reports', icon: <FileText size={24} />, label: 'Reports' },
  ];

  return (
    <aside className="sidebar">
      {navItems.map((item, idx) => (
        <NavLink
          key={idx}
          to={item.to}
          aria-label={item.label}
          className={({ isActive }) => `sidebar-icon ${isActive ? 'active' : ''}`}
        >
          {item.icon}
        </NavLink>
      ))}

      <div className="spacer" />

      <NavLink to="/profile" aria-label="Profile" className="sidebar-icon">
        <UserCircle size={24} />
      </NavLink>

      <button onClick={onLogout} className="sidebar-icon" aria-label="Logout">
        <LogOut size={24} />
      </button>
    </aside>
  );
};

export default Sidebar;
