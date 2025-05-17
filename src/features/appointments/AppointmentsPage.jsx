import React, { useState, useEffect } from "react";
import Tabs from "../../components/appointments/Tabs";
import AppointmentsTable from "../../components/appointments/AppointmentsTable";
import './AppointmentsPage.css';
import Sidebar from "../../components/sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import Spinner from "../../components/constants/spinner/Spinner";

const tabs = ["For Approval", "Ongoing Repair", "Completed"];

const AppointmentsPage = () => {
    const [activeTab, setActiveTab] = useState("For Approval");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, logout } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        fetch("/data/appointments.json")
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
            }, 1500); // 1.5 seconds delay

            return () => clearTimeout(timeout); // cleanup
        }
    }, [user, navigate]);

    if (!user) return <Spinner message='Logging out...'/>;
    if (loading) return <Spinner message='Fetching Appointments' />;

    const filteredData = data.filter((item) => item.status === activeTab);

    return (
        <>
        <Sidebar onLogout={logout} />
        <div className="p-6 bg-[#f5f7ff] min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Appointments</h1>

        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        <AppointmentsTable appointments={filteredData} />
        </div>
                 
        </>
    );
};

export default AppointmentsPage;
