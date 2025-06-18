import React, { useState, useEffect } from "react";
import DashboardLayout from "../../../features/DashboardLayout";
import { useServicesQuery } from "@/hooks/useServices.query";
import { ServiceCard } from "./components/ServiceCard";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ServiceConfigPage = () => {
  const { data, error, isLoading } = useServicesQuery();
  const role = "admin";
  const handleLogout = () => console.log("Logging out...");
  console.log(data);
  return (
    <DashboardLayout>
      <Card className="w-full bg-transparent shadow-none border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Services</CardTitle>
          <CardDescription className="line-clamp-3">
            Maintain your services here. You can add, edit, or delete services
            as needed.
          </CardDescription>
          <CardAction>
            <Button>Add Service</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data?.map((service, idx) => (
              <ServiceCard data={service} />
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default ServiceConfigPage;
