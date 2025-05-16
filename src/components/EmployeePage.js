import React from 'react';
import { Home, Calendar, Bell, Package, Wrench, Users, FileText, UserCircle, LogOut } from 'lucide-react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

function EmployeePage({ user }) {
  const navigate = useNavigate();

  const handleAddEmployee = () => {
    alert('Add Employee clicked');
  };

  const handleDeleteEmployee = () => {
    alert('Delete Employee clicked');
  };

  const employeeTypes = [
    { role: 'Office Staff', color: '#f0ad4e' },
    { role: 'Mechanic', color: '#5bc0de' },
    { role: 'Driver', color: '#5cb85c' },
    { role: 'Guard', color: '#d9534f' },
  ];

  return (
    <div className="dashboard-container">
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
        <button onClick={() => navigate('/')}><LogOut size={24} /></button>
      </aside>

      <main className="main-content">
        <h2>Employees</h2>

        <div className="appointments-section">
          {employeeTypes.map((emp, index) => (
            <div className="card" key={index} style={{ backgroundColor: emp.color }}>
              <div className="icon">👤</div>
              <div className="info">
                <h4>{emp.role}</h4>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', gap: '10px' }}>
          <button className="action-btn" onClick={handleAddEmployee}>Add Employee</button>
          <button className="action-btn" onClick={handleDeleteEmployee}>Delete Employee</button>
        </div>
      </main>
    </div>
  );
}

export default EmployeePage;


