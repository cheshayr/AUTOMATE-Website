import React, { useState, useEffect } from "react";
import Tabs from "../../components/appointments/Tabs";
import AppointmentsTable from "../../components/appointments/AppointmentsTable";
import './AppointmentsPage.css';
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import Spinner from "../../components/constants/spinner/Spinner";
import DashboardLayout from "../DashboardLayout";

const tabs = [
  "Pending Visit", 
  "Ongoing Repair", 
  "Billing",
  "Completed",
  "Cancelled",
];

const AppointmentsPage = () => {
  const [activeTab, setActiveTab] = useState("Pending Visit");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://YOUR_BACKEND_IP:5000/api/appointments")
      .then((res) => res.json())
      .then((jsonData) => {
        setData(jsonData);
      })
      .catch((error) => {
        console.error("Error loading appointments:", error);
      })
      .finally(() => setLoading(false));

    if (!user) {
      const timeout = setTimeout(() => {
        navigate('/');
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [user, navigate]);

  if (!user) return <Spinner message='Logging out...' />;
  if (loading) return <Spinner message='Fetching Appointments' />;

  const filteredData = data.filter((item) => item.status === activeTab);

  return (
    <DashboardLayout>
      <div className="bg-[#f5f7ff] min-h-screen p-6">
        <h1 className="text-4xl font-bold mb-8">Appointments</h1>
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <AppointmentsTable appointments={filteredData} />
      </div>
    </DashboardLayout>
  );
};

export default AppointmentsPage;

