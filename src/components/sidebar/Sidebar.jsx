import React from 'react';
import { Home, Calendar, Bell, Package, Wrench, Users, FileText, UserCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css'; // Optional: create this for sidebar-specific styles

const Sidebar = ({ onLogout }) => {
    const navigate = useNavigate();

    return (
        <aside className="sidebar">
            <button><Home size={24} /></button>
            <button onClick={() => navigate('/appointments')}><Calendar size={24} /></button>
            <button><Package size={24} /></button>
            <button><Bell size={24} /></button>
            <button><Wrench size={24} /></button>
            <button><Users size={24} /></button>
            <button><FileText size={24} /></button>
            <div className="spacer" />
            <button><UserCircle size={24} /></button>
            <button onClick={onLogout}><LogOut size={24} /></button>
        </aside>
    );
};

export default Sidebar;
