import React, { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import './ActivityLogs.css';

const mockActivityData = [
  {
    id: 1,
    name: 'Juan Dela Cruz',
    activity: 'Created a new appointment',
    date: '2025-06-06',
    time: '10:23 AM',
  },
  {
    id: 2,
    name: 'Maria Santos',
    activity: 'Updated inventory stock',
    date: '2025-06-06',
    time: '11:02 AM',
  },
  {
    id: 3,
    name: 'Carlos Reyes',
    activity: 'Marked service as completed',
    date: '2025-06-05',
    time: '04:45 PM',
  },
  // Add more mock logs here
];

const ActivityLogs = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setActivities(mockActivityData);
    }, 500);
  }, []);

  return (
    <div className="activity-logs-wrapper" style={{ display: 'flex' }}>
      {/* Render Sidebar */}
      <Sidebar role="staff" /> {/* or "admin" depending on your context */}

      {/* Your Activity Logs Section */}
      <div className="activity-logs-container" style={{ marginLeft: '20px', flex: 1 }}>
        <h2>Activity Logs</h2>
        <div className="activity-table">
          <div className="activity-table-header">
            <div>Name</div>
            <div>Activity</div>
            <div>Date</div>
            <div>Time</div>
          </div>
          {activities.map((log) => (
            <div className="activity-table-row" key={log.id}>
              <div>{log.name}</div>
              <div>{log.activity}</div>
              <div>{log.date}</div>
              <div>{log.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;