import React, { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { Pencil } from "lucide-react";
import "./ServiceConfigPage.css";
import DashboardLayout from "../DashboardLayout";
import { useServicesQuery } from "@/hooks/useServices.query";

const services = [
  "Change Oil",
  "GoodYear Tires",
  "Kalampag Problem",
  "Wheel Balancing",
  "Auto Electrical",
  "Underchassis",
  "Alignment",
  "Brake Disc",
  "Brakes Overhaul",
  "Power Steering",
  "Camber Correction",
  "Check Engine",
];

const ServiceConfigPage = () => {
  const { data, error, isLoading } = useServicesQuery();
  const role = "admin";
  const handleLogout = () => console.log("Logging out...");
  console.log(data);
  return (
    <DashboardLayout>
      <div className="service-header">
        <h1>Service Configuration</h1>
      </div>
      <div className="service-grid">
        {data?.map((service, idx) => (
          <div key={idx} className="service-card">
            <span>{service.name}</span>
            <button>
              <Pencil size={18} />
            </button>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default ServiceConfigPage;
