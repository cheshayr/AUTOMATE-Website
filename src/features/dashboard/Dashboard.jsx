import React, { useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './Dashboard.css';
import { useAuthContext } from '../../context/AuthContext';
import Sidebar from '../../components/sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../components/constants/spinner/Spinner';

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

const Dashboard = () => {
    const { user, logout } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            const timeout = setTimeout(() => {
                navigate('/');
            }, 1500); // 1.5 seconds delay

            return () => clearTimeout(timeout); // cleanup
        }
    }, [user, navigate]);

    if (!user) return <Spinner message='Logging out...'/>;

    const greeting = user.role === 'Admin' ? 'Welcome Admin' : 'Welcome Staff';

    return (
        <div className="dashboard-container">
        <Sidebar onLogout={logout} />
        {/* Main content */}
        <main className="main-content">
            <h2>{greeting}, {user.fullName || user.username}</h2>

            {/* Appointment Summary Cards */}
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

            {/* Charts */}
            <div className="charts-section">
            {/* Services Chart */}
            <div className="chart-box">
                <div className="chart-header">
                <h4>Service</h4>
                <a href="#">See more</a>
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

            {/* Sales Chart */}
            <div className="chart-box wide-box">
                <div className="chart-header">
                <h4>Sales Overview</h4>
                <a href="#">See more</a>
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
};

export default Dashboard;
