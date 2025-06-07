import React from 'react';
import AdminLayout from '../layouts/AdminLayout.jsx';
import { Pencil } from 'lucide-react';
import './ServiceConfigPage.css';

const services = [
  'Change Oil', 'GoodYear Tires', 'Kalampag Problem', 'Wheel Balancing',
  'Auto Electrical', 'Underchassis', 'Alignment', 'Brake Disc',
  'Brakes Overhaul', 'Power Steering', 'Camber Correction', 'Check Engine'
];

const ServiceConfigPage = () => {
  const role = 'admin';
  const handleLogout = () => console.log("Logging out...");

  return (
    <AdminLayout role={role} onLogout={handleLogout}>
      <div className="service-header">
        <h1>Service Configuration</h1>
      </div>
      <div className="service-grid">
        {services.map((service, idx) => (
          <div key={idx} className="service-card">
            <span>{service}</span>
            <button><Pencil size={18} /></button>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default ServiceConfigPage;
