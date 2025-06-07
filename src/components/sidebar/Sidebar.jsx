import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Calendar,
  Package,
  Wrench,
  ClipboardList,
  BarChart2,
  Users,
  UserCircle,
  LogOut,
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ onLogout, role }) => {
  const isAdmin = role === 'admin';

  const adminNavItems = [
    { to: '/dashboard', icon: <Home size={24} />, label: 'Dashboard' },
    { to: '/appointments', icon: <Calendar size={24} />, label: 'Appointments' },
    { to: '/services', icon: <Wrench size={24} />, label: 'Services' },
    { to: '/inventory', icon: <Package size={24} />, label: 'Inventory' },
     { to: '/user', icon: <Users size={24} />, label: 'User Management' },
    { to: '/analytics', icon: <BarChart2 size={24} />, label: 'Analytics' },
  ];

  const staffNavItems = [
    { to: '/dashboard', icon: <Home size={24} />, label: 'Dashboard' },
    { to: '/appointments', icon: <Calendar size={24} />, label: 'Appointments' },
    { to: '/services', icon: <Wrench size={24} />, label: 'Services' },
    { to: '/inventory', icon: <Package size={24} />, label: 'Inventory' },
    { to: '/activities', icon: <ClipboardList size={24} />, label: 'Activity Logs' },
    { to: '/analytics', icon: <BarChart2 size={24} />, label: 'Analytics' },
  ];

  const navItems = isAdmin ? adminNavItems : staffNavItems;

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

      {!isAdmin && (
        <>
          <NavLink to="/profile" aria-label="Profile" className="sidebar-icon">
            <UserCircle size={24} />
          </NavLink>
          <button onClick={onLogout} className="sidebar-icon" aria-label="Logout">
            <LogOut size={24} />
          </button>
        </>
      )}
    </aside>
  );
};

export default Sidebar;
