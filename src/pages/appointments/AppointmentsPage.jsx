import React, { useState, useEffect } from 'react';
import './AppointmentsPage.css';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import DashboardLayout from '../../features/DashboardLayout';
import { Sheet } from '@/components/ui/sheet';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowUpDown,
  Calendar,
  Calendar1,
  Check,
  CheckSquare,
  Eye,
  MoreHorizontal,
  Plus,
  Table,
  Timer,
  Upload,
} from 'lucide-react';
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
import { useAppointments, useGetAppointmentSummary } from '@/hooks/useAppointments.query';
import DataTable from './components/DataTable';
import AppointmentForm from './components/AppointmentForm';
import { Dialog } from '@/components/ui/dialog';
import { CalendarEvent } from './components/CalendarEvent';
import { useAdminDeleteAppointment, useAdminUpdateAppointment } from '@/hooks/useAppointments.mutation';
import { useFetchUsers } from '@/hooks/useUsersQuery';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Appointments } from '@/features/analytics/Appointments';
import AppointmentCard from './components/AppointmentCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import AppointmentSheet from './components/AppointmentSheet';
import { toast } from 'sonner';

const status = ['Pending Visit', 'Ongoing Repair', 'Billing', 'Completed', 'Cancelled'];

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
  const { user } = useAuthContext();
  const { data, isLoading } = useAppointments();
  const { data: summaryData, isLoading: summaryIsLoading } = useGetAppointmentSummary();
  const { data: users } = useFetchUsers('', 'staff');
  const isAdmin = user?.role === 'admin';
  const appointments = data?.appointments || [];
  const staff = users?.data || [];
  console.log({ user });
  const [date, setDate] = useState(new Date());
  const [staffList, setStaffList] = useState([]); // Initialize as empty array
  const [vehicleList, setVehicleList] = useState([appointments?.vehicle]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (users?.data) {
      setStaffList(users.data);
    }
  }, [users]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalInvoiceOpen, setIsModalInvoiceOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(''); // For invoice modal, if needed
  const [editingAppointment, setEditingAppointment] = useState(null); // null for new, object for edit
  const { mutateAsync: appointmentMutation } = useAdminUpdateAppointment();
  const { mutateAsync: appointmentDeleteMutation } = useAdminDeleteAppointment();

  const summary = [
    {
      title: 'Total Appointments',
      value: summaryIsLoading ? <LoadingSpinner /> : summaryData?.summary.total,
      icon: <Calendar />,
      bgColor: 'bg-blue-500',
    },
    {
      title: "Today's Appointments",
      value: summaryIsLoading ? <LoadingSpinner /> : summaryData?.summary.today,
      icon: <Calendar1 />,
      bgColor: 'bg-orange-500',
    },
    {
      title: 'On-going',
      value: summaryIsLoading ? <LoadingSpinner /> : summaryData?.summary.ongoing,

      icon: <Timer />,
      bgColor: 'bg-yellow-500',
    },
    {
      title: 'Completed',
      value: summaryIsLoading ? <LoadingSpinner /> : summaryData?.summary.completed,

      icon: <Check />,
      bgColor: 'bg-green-500',
    },
    {
      title: 'Canceled',
      value: summaryIsLoading ? <LoadingSpinner /> : summaryData?.summary.canceled,
      icon: <Check />,
      bgColor: 'bg-red-500',
    },
  ];

  const handleOpenModal = (appointment = null) => {
    setEditingAppointment(appointment);
    // setIsModalOpen(true);
    setIsSheetOpen(true);
  };

  const handleCloseModal = () => {
    setEditingAppointment(null);
    // setIsModalOpen(false);
    setIsSheetOpen(false);
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
    if (!isAdmin) toast('You are not allowed to make this action.');
    if (editingAppointment) {
      console.log('Updating appointment:', editingAppointment._id, formData);
      const scheduledTime = `${formData.scheduledDate}T${formData.scheduledTime}`;
      const updatedData = {
        // scheduledTime,
        assignedStaff: formData.assignedStaff,
        status: formData.status,
        notes: {
          // customerNotes: formData.customerNotes,
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

  const handleDeleteAppointment = async (appointmentId) => {
    if (!confirm(`Are you sure you want to delete the appointment?`)) return;

    await appointmentDeleteMutation({ id: appointmentId._id, appointmentId });
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
      accessorKey: 'refNo',
      header: 'Ref #',
      cell: ({ row }) => <div className="capitalize font-medium">{row.original.refNo}</div>,
    },
    {
      accessorKey: 'name',
      header: 'Customer',
      cell: ({ row }) => <div className="capitalize">{row.original.name}</div>,
    },
    {
      accessorKey: 'vehicle',
      header: 'Vehicle',
      cell: ({ row }) => (
        <div>
          <div>{`${row.original.vehicle.brand} ${row.original.vehicle.model} (${row.original.vehicle.year})`}</div>
          <div className="text-muted-foreground text-xs">{row.original.vehicle.licensePlate}</div>
        </div>
      ),
    },
    {
      accessorKey: 'services',
      header: 'Services',
      cell: ({ row }) => (
        <div>
          {row.original.services && row.original.services.length > 0 ? (
            row.original.services.map((service, index) => <div key={index}>{service.service.name}</div>)
          ) : (
            <div className="text-muted-foreground text-xs">No services listed</div>
          )}
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
          Canceled: 'bg-red-200/50',
        };
        return (
          <Badge variant={row.getValue('status')} className={bgColorMap[row.getValue('status')]}>
            {row.getValue('status')}
          </Badge>
        );
      },
    },
    ...(isAdmin
      ? [
          {
            header: 'Quick Actions',
            enableHiding: false,

            cell: ({ row }) => {
              const appointment = row.original;
              const statusMap = ['Pending', 'Booked', 'Vehicle Arrived', 'Assessment', 'In Progress', 'Completed'];
              const btnStatusText = [
                'Pending',
                'Confirm Booking',
                'Vehicle Arrived',
                'Assessment',
                'In Progress',
                'Completed',
              ];

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
                      <CheckSquare /> {btnStatusText[nextStatusIndex]}
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
        ]
      : []),

    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const appointment = row.original;
        const statusMap = ['Pending', 'Booked', 'Vehicle Arrived', 'Assessment', 'In Progress', 'Completed'];
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
          <div className="flex justify-end gap-2">
            <Button variant={'outline'} onClick={handleOpenModal.bind(null, appointment)}>
              <Eye />
            </Button>
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
                    await navigator.clipboard.writeText(appointment.refNo);
                    alert(`Appointment ID ${appointment.refNo} copied to clipboard!`);
                  }}
                >
                  Copy Appointment ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {/* <DropdownMenuItem onSelect={handleOpenModal.bind(null, appointment)}>View / Edit</DropdownMenuItem> */}
                <DropdownMenuItem onSelect={handleOpenModal.bind(null, appointment)}>View Invoice</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-700 focus:bg-red-50"
                  onSelect={handleDeleteAppointment.bind(null, appointment)}
                  disabled={!isAdmin}
                >
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
    <Tabs defaultValue="table">
      <div className="flex items-center justify-between mb-4">
        <Card className="flex-1 bg-transparent shadow-none border-0">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Appointments</CardTitle>
            <CardDescription className="line-clamp-3">
              Manage your appointments efficiently. You can view, edit, or delete existing appointments as needed.
            </CardDescription>
            <CardAction>
              <TabsList>
                <TabsTrigger value="table">
                  <Table /> Table
                </TabsTrigger>
                <TabsTrigger value="calendar">
                  <Calendar /> Calendar
                </TabsTrigger>
              </TabsList>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 pb-4 mb-4">
              {summary.map((item) => (
                <AppointmentCard key={item.title} data={item} />
              ))}
            </div>
            <TabsContent value="table">
              <DataTable columns={columns} data={appointments} className="flex-1" />
            </TabsContent>
            <TabsContent value="calendar">
              <Appointments />
            </TabsContent>
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
          {/* <Dialog open={isModalInvoiceOpen} onOpenChange={setIsModalInvoiceOpen}>
            {isModalInvoiceOpen && (
              <AppointmentForm
                appointment={editingAppointment}
                onSave={handleSaveAppointment}
                onCancel={handleCloseModal}
                staffList={staffList}
                vehicleList={vehicleList}
              />
            )}
          </Dialog> */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            {isSheetOpen && (
              <AppointmentSheet
                appointment={editingAppointment}
                onSave={handleSaveAppointment}
                onCancel={handleCloseModal}
                staffList={staffList}
                vehicleList={vehicleList}
              />
            )}
          </Sheet>
        </Card>
        {/* <Card className={'bg-transparent shadow-none border-0'}></Card> */}
        {/* <div className="bg-[#f5f7ff] min-h-screen p-6">
        <h1 className="text-4xl font-bold mb-8">Appointments</h1>
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        <AppointmentsTable appointments={filteredData} />
      </div> */}
      </div>
    </Tabs>

    // </DashboardLayout>
  );
};

export default AppointmentsPage;
