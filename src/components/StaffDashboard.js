import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Home, Calendar, Bell, Package, Wrench, Users, FileText, UserCircle, LogOut } from 'lucide-react';
import './Dashboard.css';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const appointmentStats = [
  { label: 'For Approval', count: 3, color: '#FFC107', icon: '⏰' },
  { label: 'Ongoing Repair', count: 5, color: '#007BFF', icon: '⚙️' },
  { label: 'Completed', count: 5, color: '#28A745', icon: '✅' },
];

const serviceData = [
  { name: 'Oil Change', count: 25 },
  { name: 'Underchassis', count: 18 },
  { name: 'Change Tires', count: 27 },
];

const salesData = [
  { name: 'Jan', value: 50000 },
  { name: 'Feb', value: 60000 },
  { name: 'Mar', value: 80000 },
  { name: 'Apr', value: 70000 },
  { name: 'May', value: 30000 },
];

function StaffDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  
  if (!user) return <p>Loading or please login...</p>;

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <button><Home size={24} /></button>
        <button onClick={() => navigate('/appointments')}>
  <Calendar size={24} />
</button>
        <button><Package size={24} /></button>
        <button><Bell size={24} /></button>
        <button><Wrench size={24} /></button>
        <button><Users size={24} /></button>
        <button><FileText size={24} /></button>
        <div className="spacer" />
        <button><UserCircle size={24} /></button>
        <button><LogOut size={24} /></button>
        <button><LogOut size={24} /></button>
      </aside>

      <main className="main-content">
        <h2>Staff Dashboard, Welcome {user?.fullName || user?.username || 'User'}</h2>

        <div className="appointments-section">
          {appointmentStats.map((item, idx) => (
            <div className="card" key={idx} style={{ backgroundColor: item.color }}>
              <div className="icon">{item.icon}</div>
              <div className="info">
                <h4>{item.label}</h4>
                <p>{item.count}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="charts-section">
          <div className="chart-box">
            <div className="chart-header">
              <h4>Service</h4>
              <Link to="/services">See more</Link>
            </div>
            <ResponsiveContainer width="100%" height={150}>
  <BarChart data={serviceData} layout="vertical">
    <XAxis type="number" />
    <YAxis dataKey="name" type="category" />
    <Tooltip />
    <Bar dataKey="count" fill="#007BFF" />
  </BarChart>
</ResponsiveContainer>

          </div>

          <div className="chart-box wide-box">
            <div className="chart-header">
              <h4>Sales Overview</h4>
              <Link to="/sales">See more</Link>
            </div>
            <div className="sales-content">
              <div className="sales-chart">
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={salesData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#0056b3" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="sales-totals">
                <p>Total Sales: <strong>₱227,977</strong></p>
                <p>Total Profit: <strong>₱68,393.10</strong></p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default StaffDashboard;
