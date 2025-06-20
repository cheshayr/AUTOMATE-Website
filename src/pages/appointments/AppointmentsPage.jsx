import React, { useState, useEffect } from 'react';
import './AppointmentsPage.css';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import DashboardLayout from '../../features/DashboardLayout';

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, CheckSquare, MoreHorizontal, Plus, Upload } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AppointmentsDataTable from './components/DataTable';
import { useAppointments } from '@/hooks/useAppointments.query';
import DataTable from './components/DataTable';
import AppointmentForm from './components/AppointmentForm';
import { Dialog } from '@/components/ui/dialog';
import { CalendarEvent } from './components/CalendarEvent';
import { useAdminUpdateAppointment } from '@/hooks/useAppointments.mutation';

const tabs = ['Pending Visit', 'Ongoing Repair', 'Billing', 'Completed', 'Cancelled'];

const events = [
  {
    title: 'Team Sync Meeting',
    from: '2025-06-12T09:00:00',
    to: '2025-06-12T10:00:00',
  },
  {
    title: 'Design Review',
    from: '2025-06-12T11:30:00',
    to: '2025-06-12T12:30:00',
  },
  {
    title: 'Client Presentation',
    from: '2025-06-12T14:00:00',
    to: '2025-06-12T15:00:00',
  },
];

// --- 1. DEFINE TABLE COLUMNS ---

const AppointmentsPage = () => {
  const { data } = useAppointments();
  const appointments = data?.appointments || [];

  const [date, setDate] = useState(new Date());
  const [staffList, setStaffList] = useState([]);
  const [vehicleList, setVehicleList] = useState([data?.appointments?.vehicle]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalInvoiceOpen, setIsModalInvoiceOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(''); // For invoice modal, if needed
  const [editingAppointment, setEditingAppointment] = useState(null); // null for new, object for edit
  const { mutateAsync: appointmentMutation } = useAdminUpdateAppointment();
  const handleOpenModal = (appointment = null) => {
    console.log(appointment);
    setEditingAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAppointment(null);
  };

  const handleOpenInvoiceModal = (appointmentId) => {
    console.log('Opening invoice modal for appointment:', appointmentId);
    setIsModalInvoiceOpen(true);
    setSelectedAppointment(appointmentId);
  };

  const handleCloseInvoiceModal = (appointmentId) => {
    console.log('Closing invoice modal for appointment:', appointmentId);
    setIsModalInvoiceOpen(false);
    setSelectedAppointment('');
  };

  const handleSaveAppointment = async (formData) => {
    if (editingAppointment) {
      console.log('Updating appointment:', editingAppointment._id, formData);
      const scheduledTime = `${formData.scheduledDate}T${formData.scheduledTime}`;
      const updatedData = {
        scheduledTime,
        status: formData.status,
        notes: {
          customerNotes: formData.customerNotes,
          staffNotes: formData.staffNotes,
        },
      };

      await appointmentMutation({ id: editingAppointment._id, updatedData });
    } else {
      // Logic to POST/create a new appointment
      console.log('Creating new appointment:', formData);
    }
    // For demo, we just close the modal. In real app, you'd refetch data.
    handleCloseModal();
  };

  const handleDeleteAppointment = (appointmentId) => {
    console.log('Deleting appointment:', appointmentId);
    // Add API call and refetch logic here
  };

  const handleQuickUpdateStatus = async (appointmentId, newStatus) => {
    console.info(`Updating status of appointment: ${appointmentId}`);
    if (!confirm(`Are you sure you want to change the status into ${newStatus}`)) return;

    const updatedData = {
      status: newStatus,
    };

    await appointmentMutation({ id: appointmentId, updatedData });
  };
  const columns = [
    {
      accessorKey: 'name',
      header: 'Customer',
      cell: ({ row }) => <div className="capitalize font-medium">{row.original.name}</div>,
    },
    {
      accessorKey: 'vehicle',
      header: 'Vehicle',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{`${row.original.vehicle.brand} ${row.original.vehicle.model}`}</div>
          <div className="text-muted-foreground text-xs">{row.original.vehicle.licensePlate}</div>
        </div>
      ),
    },
    {
      accessorKey: 'scheduledTime',
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Scheduled Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="pl-4">{new Date(row.getValue('scheduledTime')).toLocaleString()}</div>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const bgColorMap = {
          Completed: 'bg-green-200/50',
          Booked: 'bg-blue-200/50',
          'In Progress': 'bg-yellow-200/50',
          'Vehicle Arrived': 'bg-orange-200/50',
        };
        return (
          <Badge variant={row.getValue('status')} className={bgColorMap[row.getValue('status')]}>
            {row.getValue('status')}
          </Badge>
        );
      },
    },
    // {
    //   accessorKey: 'assignedStaff.name',
    //   header: 'Assigned Staff',
    //   cell: ({ row }) => (
    //     <div>
    //       {row.original.assignedStaff?.name || <span className="text-sm italic text-muted-foreground">Unassigned</span>}
    //     </div>
    //   ),
    // },
    {
      header: 'Quick Actions',
      enableHiding: false,
      cell: ({ row }) => {
        const appointment = row.original;
        const statusMap = ['Booked', 'Vehicle Arrived', 'Assessment', 'In Progress', 'Completed'];
        const currentStatusIndex = statusMap.indexOf(row.original.status);
        const nextStatusIndex = currentStatusIndex > statusMap.length ? statusMap.length : currentStatusIndex + 1;
        console.log(appointment._id);
        return (
          <>
            {currentStatusIndex !== statusMap.length - 1 ? (
              <Button
                variant={'outline'}
                onClick={handleQuickUpdateStatus.bind(null, appointment._id, statusMap[nextStatusIndex])}
              >
                <CheckSquare /> {statusMap[nextStatusIndex]}
              </Button>
            ) : (
              <Button variant={'outline'} onClick={handleOpenInvoiceModal.bind(null, appointment._id)}>
                <Upload /> Upload Invoice
              </Button>
            )}
          </>
        );
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const appointment = row.original;
        const statusMap = ['Booked', 'Vehicle Arrived', 'Assessment', 'In Progress', 'Completed'];
        const currentStatusIndex = statusMap.indexOf(row.original.status);
        const nextStatusIndex = currentStatusIndex > statusMap.length ? statusMap.length : currentStatusIndex + 1;
        const handleDelete = () => {
          // In a real app, you would open a confirmation modal here
          // instead of using window.confirm
          console.log({ appointment });
          console.log(`Deletion requested for appointment: ${appointment._id} `);
          // Example: showModal({ type: 'delete', id: appointment._id });
        };

        return (
          <div className="flex justify-between">
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
                    alert(`Appointment ID ${appointment._id} copied to clipboard!`);
                  }}
                >
                  Copy Appointment ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleOpenModal.bind(null, appointment)}>View / Edit</DropdownMenuItem>
                <DropdownMenuItem onSelect={handleOpenModal.bind(null, appointment)}>View Invoice</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 focus:text-red-700 focus:bg-red-50" onSelect={handleDelete}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return (
    // <DashboardLayout>
    <div className="flex items-center justify-between mb-4">
      <Card className="flex-1 bg-transparent shadow-none border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Appointments</CardTitle>
          <CardDescription className="line-clamp-3">
            Manage your appointments efficiently. You can view, edit, or delete existing appointments as needed.
          </CardDescription>
          {/* <CardAction>
            <Button onClick={handleOpenModal}>
              <Plus />
              Create Appointment
            </Button>
          </CardAction> */}
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
          <div className="flex gap-4">
            <DataTable columns={columns} data={appointments} className="flex-1" />
            {/* <div>
              <CalendarEvent date={date} setDate={setDate} data={events} />
            </div> */}
          </div>
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
        <Dialog open={isModalInvoiceOpen} onOpenChange={setIsModalInvoiceOpen}>
          {isModalInvoiceOpen && (
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
      {/* <Card className={'bg-transparent shadow-none border-0'}></Card> */}
      {/* <div className="bg-[#f5f7ff] min-h-screen p-6">
        <h1 className="text-4xl font-bold mb-8">Appointments</h1>
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        <AppointmentsTable appointments={filteredData} />
      </div> */}
    </div>

    // </DashboardLayout>
  );
};

export default AppointmentsPage;
