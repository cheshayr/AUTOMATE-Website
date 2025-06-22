import React, { useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './Dashboard.css';
import { useAuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../components/constants/spinner/Spinner';
import DashboardLayout from '../../features/DashboardLayout';
import { ChartServices } from '@/components/dashboard/ChartServices';
import { ChartSales } from '@/components/dashboard/ChartSales';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Ban, Calendar, Calendar1, Car, Check, Package, StopCircle, Timer, User, Users, Wrench } from 'lucide-react';
import SummaryCard from '@/components/SummaryCard';
import { useGetAppointmentSummary } from '@/hooks/useAppointments.query';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useGetDashboardSummary } from '@/hooks/useDashboard.query';

const kpiData = [
  {
    title: "Today's Appointments",
    value: '12',
    icon: Car,
    color: 'text-blue-400',
    bgColor: 'bg-blue-100',
  },
  {
    title: 'Ongoing Repairs',
    value: '5',
    icon: Wrench,
    color: 'text-orange-400',
    bgColor: 'bg-orange-100',
  },
  {
    title: 'Completed Repairs',
    value: '3',
    icon: Check,
    color: 'text-green-400',
    bgColor: 'bg-green-100',
  },
  {
    title: 'Available Staff',
    value: '8',
    icon: Users,
    color: 'text-red-400',
    bgColor: 'bg-red-100',
  },
];

const appointmentStats = [
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
  const { user } = useAuthContext();
  const { data: summaryData, isLoading: summaryIsLoading } = useGetDashboardSummary();

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
          {/* <CardDescription className="line-clamp-3"></CardDescription> */}
          {/* <CardAction>
            <Button onClick={handleAddServiceClick}>
              <Plus />
              Add Service
            </Button>
          </CardAction> */}
        </CardHeader>
        <CardContent className={'flex flex-col gap-4'}>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {summary.map((item) => (
              <SummaryCard key={item.title} data={item} />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3  gap-4">
            <div className="w-full max-h-96">
              <ChartServices />
            </div>
            <div className="w-full">
              <ChartSales />
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
            <div className="w-96">
              <ChartServices />
            </div>
            <div className="w-96">
              <ChartSales />
            </div>
            {/* <div className="chart-box">
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
            </div> */}

            {/* Sales Chart */}
            {/* <div className="chart-box wide-box">
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
                  <p>
                    Total Sales: <strong>₱227,977</strong>
                  </p>
                  <p>
                    Total Profit: <strong>₱68,393.10</strong>
                  </p>
                </div>
              </div>
            </div> */}
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
