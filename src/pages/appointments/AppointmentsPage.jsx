import React, { useState, useEffect } from "react";
import "./AppointmentsPage.css";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import DashboardLayout from "../../features/DashboardLayout";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AppointmentsDataTable from "./components/DataTable";
import { useAppointments } from "@/hooks/useAppointments.query";
import DataTable from "./components/DataTable";
import AppointmentForm from "./components/AppointmentForm";
import { Dialog } from "@/components/ui/dialog";

const tabs = [
  "Pending Visit",
  "Ongoing Repair",
  "Billing",
  "Completed",
  "Cancelled",
];

// --- 1. DEFINE TABLE COLUMNS ---

const AppointmentsPage = () => {
  const { data } = useAppointments();
  const appointments = data?.appointments || [];

  const [staffList, setStaffList] = useState([]);
  const [vehicleList, setVehicleList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null); // null for new, object for edit

  const handleOpenModal = (appointment = null) => {
    console.log(appointment);
    setEditingAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAppointment(null);
  };

  const handleSaveAppointment = (formData) => {
    if (editingAppointment) {
      // Logic to PATCH/update an existing appointment
      console.log("Updating appointment:", editingAppointment._id, formData);
    } else {
      // Logic to POST/create a new appointment
      console.log("Creating new appointment:", formData);
    }
    // For demo, we just close the modal. In real app, you'd refetch data.
    handleCloseModal();
  };

  const handleDeleteAppointment = (appointmentId) => {
    console.log("Deleting appointment:", appointmentId);
    // Add API call and refetch logic here
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Customer",
      cell: ({ row }) => (
        <div className="capitalize font-medium">{row.original.name}</div>
      ),
    },
    {
      accessorKey: "vehicle",
      header: "Vehicle",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{`${row.original.vehicle.brand} ${row.original.vehicle.model}`}</div>
          <div className="text-muted-foreground text-xs">
            {row.original.vehicle.licensePlate}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "scheduledTime",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Scheduled Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="pl-4">
          {new Date(row.getValue("scheduledTime")).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.getValue("status")}>{row.getValue("status")}</Badge>
      ),
    },
    {
      accessorKey: "assignedStaff.name",
      header: "Assigned Staff",
      cell: ({ row }) => (
        <div>
          {row.original.assignedStaff?.name || (
            <span className="text-sm italic text-muted-foreground">
              Unassigned
            </span>
          )}
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const appointment = row.original;

        const handleDelete = () => {
          // In a real app, you would open a confirmation modal here
          // instead of using window.confirm
          console.log(`Deletion requested for appointment: ${appointment._id}`);
          // Example: showModal({ type: 'delete', id: appointment._id });
        };

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onSelect={async () => {
                  await navigator.clipboard.writeText(appointment._id);
                  alert(
                    `Appointment ID ${appointment._id} copied to clipboard!`
                  );
                }}
              >
                Copy Appointment ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={handleOpenModal.bind(null, appointment)}
              >
                View / Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={handleOpenModal.bind(null, appointment)}
              >
                View Invoice
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-700 focus:bg-red-50"
                onSelect={handleDelete}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

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
            <Button onClick={handleOpenModal}>
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
          <DataTable columns={columns} data={appointments} />
        </CardContent>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          {isModalOpen && (
            <AppointmentForm
              appointment={editingAppointment}
              onSave={handleSaveAppointment}
              onCancel={handleCloseModal}
              staffList={staffList}
              vehicleList={vehicleList}
            />
          )}
        </Dialog>
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
