import React, { useState, useEffect } from "react";
import Tabs from "../../../components/appointments/Tabs";
import AppointmentsTable from "../../../components/appointments/AppointmentsTable";
import "./AppointmentsPage.css";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";
import Spinner from "../../../components/constants/spinner/Spinner";
import DashboardLayout from "../../../features/DashboardLayout";

import { useServicesQuery } from "@/hooks/useServices.query";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

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
        navigate("/");
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [user, navigate]);

  if (!user) return <Spinner message="Logging out..." />;
  if (loading) return <Spinner message="Fetching Appointments" />;

  const filteredData = data.filter((item) => item.status === activeTab);

  return (
    <DashboardLayout>
      <Card className="w-full bg-transparent shadow-none border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Appointments</CardTitle>
          <CardDescription className="line-clamp-3">
            Manage your appointments efficiently. You can view, edit, or delete
            existing appointments as needed.
          </CardDescription>
          <CardAction>
            <Button onClick={() => {}}>
              <Plus />
              Create Appointment
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {data?.map((service, idx) => (
                <ServiceCard
                  key={service._id}
                  data={service}
                  handleDelete={() => handleDelete(service._id)}
                  handleEdit={() => handleEditServiceClick(service)}
                />
              ))}
            </div> */}
        </CardContent>
      </Card>
      {/* <div className="bg-[#f5f7ff] min-h-screen p-6">
        <h1 className="text-4xl font-bold mb-8">Appointments</h1>
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        <AppointmentsTable appointments={filteredData} />
      </div> */}
    </DashboardLayout>
  );
};

export default AppointmentsPage;
