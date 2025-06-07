import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminAnalytics = () => {
  // Data for Top Assigned Mechanics
  const mechanicsData = {
    labels: ['Arnel', 'Arnold', 'Ronald', 'Victor', 'Roland', 'Virgie', 'Eddie'],
    datasets: [
      {
        label: 'Assignments',
        data: [25, 20, 15, 10, 8, 5, 3],
        backgroundColor: '#1E90FF', 
        borderColor: '#1E90FF',
        borderWidth: 1,
      },
    ],
  };

  // Data for Services
  const servicesData = {
    labels: [
      'Goodyear Tires',
      'Wheel Balancing',
      'Computerized 4W Alignment',
      'Kalampag Problem',
      'Change Oil/Tune-up',
      'Undercarriage / Suspension',
      'Brake Disc / Drum Refacing',
      'Brakes Overhaul',
      'Power Steering',
      'Camber Correction',
      'Body Lift / Body Lowered',
      'Check Engine Scanning',
      'Auto Electrical',
      'Battery & Accessories',
    ],
    datasets: [
      {
        label: 'Service Count',
        data: [
          85, 70, 60, 50, 45, 35, 30, 25, 20, 15, 10, 8, 6, 5,
        ],
        backgroundColor: '#1E90FF', // Dodger Blue for visibility
        borderColor: '#1E90FF',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Analytics</h1>
      <div style={{ marginBottom: '40px' }}>
        <h2>Top Assigned Mechanics</h2>
        <Bar data={mechanicsData} options={options} />
      </div>
      <div>
        <h2>Services</h2>
        <Bar data={servicesData} options={options} />
      </div>
    </div>
  );
};

export default AdminAnalytics;