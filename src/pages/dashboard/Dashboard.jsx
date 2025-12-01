import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './Dashboard.css';
import { useAuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../components/constants/spinner/Spinner';
import DashboardLayout from '../../features/DashboardLayout';
import { ChartServices } from '@/components/dashboard/ChartServices';
import { ChartSales } from '@/components/dashboard/ChartSales';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button'; // Ensure Button is imported
import { Ban, Calendar, Calendar1, Car, Check, Package, StopCircle, Timer, User, Users, Wrench } from 'lucide-react';
import SummaryCard from '@/components/SummaryCard';
import { useGetAppointmentSummary } from '@/hooks/useAppointments.query';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useGetDashboardSummary } from '@/hooks/useDashboard.query';

const appointmentStats = [
  { label: 'Ongoing Repair', count: 5, color: '#007BFF', icon: '⚙️' },
  { label: 'Completed', count: 5, color: '#28A745', icon: '✅' },
];

const Dashboard = () => {
  const { user } = useAuthContext();
  const { data: summaryData, isLoading: summaryIsLoading } = useGetDashboardSummary();
  
  // State for the filter
  const [filter, setFilter] = useState('monthly');

  const summary = [
    {
      title: 'Total Appointments',
      value: summaryIsLoading ? <LoadingSpinner /> : summaryData?.summary.total,
      icon: <Calendar />,
      bgColor: 'bg-blue-500',
      url: '/appointments',
    },
    {
      title: "Today's Appointments",
      value: summaryIsLoading ? <LoadingSpinner /> : summaryData?.summary.today,
      icon: <Calendar1 />,
      bgColor: 'bg-orange-500',
      url: '/appointments',
    },
    {
      title: 'On-going',
      value: summaryIsLoading ? <LoadingSpinner /> : summaryData?.summary.ongoing,
      icon: <Timer />,
      bgColor: 'bg-yellow-500',
      url: '/appointments',
    },
    {
      title: 'Completed',
      value: summaryIsLoading ? <LoadingSpinner /> : summaryData?.summary.completed,
      icon: <Check />,
      bgColor: 'bg-green-500',
      url: '/appointments',
    },
    {
      title: 'Canceled',
      value: summaryIsLoading ? <LoadingSpinner /> : summaryData?.summary.canceled,
      icon: <Ban />,
      bgColor: 'bg-red-500',
      url: '/appointments',
    },
    {
      title: 'Staff',
      value: summaryIsLoading ? <LoadingSpinner /> : summaryData?.summary.staff,
      icon: <User />,
      bgColor: 'bg-blue-500',
      url: '/user',
    },
    {
      title: 'Customer',
      value: summaryIsLoading ? <LoadingSpinner /> : summaryData?.summary.customer,
      icon: <User />,
      bgColor: 'bg-blue-500',
      url: '/user',
    },
  ];

  const greeting = user?.role === 'admin' ? 'Welcome Admin!' : 'Welcome Staff!';

  return (
    <>
      <Card className="w-full bg-transparent shadow-none border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">{greeting}</CardTitle>
        </CardHeader>
        <CardContent className={'flex flex-col gap-4'}>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {summary.map((item) => (
              <SummaryCard key={item.title} data={item} />
            ))}
          </div>

          {/* Filter Controls */}
          <div className="flex items-center justify-end gap-2 mt-4">
             <span className="text-sm text-muted-foreground font-medium">Filter Charts:</span>
             <Button 
                variant={filter === 'today' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('today')}
             >
               Today
             </Button>
             <Button 
                variant={filter === 'weekly' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('weekly')}
             >
               Weekly
             </Button>
             <Button 
                variant={filter === 'monthly' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('monthly')}
             >
               Monthly
             </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="w-full max-h-96">
              {/* Pass the filter prop */}
              <ChartServices filter={filter} />
            </div>
            <div className="w-full">
              {/* Pass the filter prop */}
              <ChartSales filter={filter} />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="dashboard-container !hidden">
        {/* Main content */}
        <main className="main-content">
          <h2>
            {greeting}, {user.name || user.username}
          </h2>

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
            <div className="w-96">
              <ChartServices filter={filter} />
            </div>
            <div className="w-96">
              <ChartSales filter={filter} />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
