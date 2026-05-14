import React, { useState, useEffect } from 'react';
import AppointmentProgress from './components/AppoinmentProgress';
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
  Download,
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
import {
  useAdminDeleteAppointment,
  useAdminUpdateAppointment,
  useUploadInvoice,
} from '@/hooks/useAppointments.mutation';
import { useFetchUsers } from '@/hooks/useUsersQuery';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Appointments } from '@/features/analytics/Appointments';
import AppointmentCard from './components/AppointmentCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import AppointmentSheet from './components/AppointmentSheet';
import { toast } from 'sonner';
import UploadInvoice from './components/UploadInvoice';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import logoImage from '../../assets/logo.png'; // <-- adjust path to your logo
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'; // <-- THIS IS MISSING
 // <--- THIS WAS MISSING


const status = [
  'Pending',
  'Booked',
  'Vehicle Arrived',
  'Assessment',
  'In Progress',
  'Completed',
  'Canceled',
];


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
  // we added '1' for page 1, '100' for the limit, and 'active' for the status
  const { data: users } = useFetchUsers('', 'staff', 1, 100, 'active');
  const isAdmin = user?.role === 'admin';
  const appointments = data?.appointments || [];
const [statusFilter, setStatusFilter] = useState('All'); 
const [preparedBy, setPreparedBy] = useState(''); // For PDF report
// <-- move this up BEFORE filteredAppointments

const filteredAppointments =
  (statusFilter === 'All'
    ? appointments
    : appointments.filter((a) => a.status === statusFilter)
  )
  .slice()
  .sort((a, b) => {
    const dateA = new Date(a.scheduledTime || a.createdAt || 0);
    const dateB = new Date(b.scheduledTime || b.createdAt || 0);
    return dateB - dateA; // newest appointment first
  });

const staff = users?.data || [];

  console.log({ user });
  const [date, setDate] = useState(new Date());
  const [staffList, setStaffList] = useState([]); // Initialize as empty array
  // const [vehicleList, setVehicleList] = useState([appointments?.vehicle]);
  const [vehicleList, setVehicleList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invoiceFile, setInvoiceFile] = useState(null); 
  const [adminPassword, setAdminPassword] = useState("");// No type annotation



  useEffect(() => {
    if (users?.data) {
      setStaffList(users.data);
    }
  }, [users]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalInvoiceOpen, setIsModalInvoiceOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [progressAppointment, setProgressAppointment] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(''); // For invoice modal, if needed
  const [editingAppointment, setEditingAppointment] = useState(null); // null for new, object for edit
  const { mutateAsync: appointmentMutation } = useAdminUpdateAppointment();
  const { mutateAsync: appointmentDeleteMutation } = useAdminDeleteAppointment();
  const { mutateAsync: uploadInvoiceMutation } = useUploadInvoice();

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

  const handleOpenProgress = (appointment) => {
  setProgressAppointment(appointment);
  setIsProgressOpen(true);
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

  const handleUploadInvoice = async (e) => {
  e.preventDefault();

  try {
    if (!adminPassword.trim()) {
      toast.error("Admin password is required.");
      return;
    }

    const formDataInitial = new FormData(e.target);
    const formData = new FormData();

    const finalCost = formDataInitial.get("finalCost");

    formData.append("finalCost", finalCost);
    formData.append("id", selectedAppointment);
    formData.append("adminPassword", adminPassword);

    if (invoiceFile) formData.append("image", invoiceFile);

    await uploadInvoiceMutation({
      id: selectedAppointment,
      updatedData: formData,
    });

    toast.success("Receipt uploaded successfully.");

    setAdminPassword("");
    setInvoiceFile(null);
    handleCloseInvoiceModal();
  } catch (error) {
    toast.error(
      error?.response?.data?.message ||
      "Failed to upload receipt."
    );
  }
};

  const COMPANY_NAME = "Tierodman Auto Center";

const handleExportPDF = () => {
  if (!preparedBy.trim()) {
    toast.error('Please enter who prepared the report.');
    return;
  }

  if (!filteredAppointments || filteredAppointments.length === 0) {
    toast.error(`No appointments found for status "${statusFilter}".`);
    return;
  }

  const doc = new jsPDF();
  const exportedAt = format(new Date(), 'MMM dd, yyyy • hh:mm a');

  autoTable(doc, {
    startY: 75,
    head: [['Ref #', 'Customer', 'Vehicle', 'Services', 'Status', 'Scheduled Time']],
    body: filteredAppointments.map((a) => [
      a.refNo || '-',
      a.name || '-',
      a.vehicle
        ? `${a.vehicle?.brand || '-'} ${a.vehicle?.model || '-'} (${a.vehicle?.year || '-'})`
        : '-',
      a.services?.map((s) => s?.service?.name || '-').join(', ') || '-',
      a.status || '-',
      a.scheduledTime ? new Date(a.scheduledTime).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }) : '-',
    ]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [71, 85, 105] },

    didDrawPage: function (data) {
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      const pageNumber = doc.internal.getCurrentPageInfo().pageNumber;
      const pageCount = doc.internal.getNumberOfPages();

      // ===== HEADER (FIRST PAGE ONLY) =====
      if (pageNumber === 1) {
        doc.addImage(logoImage, 'PNG', 14, 10, 40, 40);
        doc.setFontSize(16);
        doc.text('Appointments Report', pageWidth / 2, 25, { align: 'center' });
        doc.setFontSize(10);
        doc.text(COMPANY_NAME, pageWidth / 2, 32, { align: 'center' });
        doc.text(`Status Filter: ${statusFilter}`, 14, 50);
        doc.text(`Prepared By: ${preparedBy}`, 14, 57);
        doc.text(`Exported On: ${exportedAt}`, 14, 64);
        doc.setLineWidth(0.3);
        doc.line(14, 70, pageWidth - 14, 70);
      }

      // ===== FOOTER (ALL PAGES) =====
      doc.setLineWidth(0.3);
      doc.line(14, pageHeight - 15, pageWidth - 14, pageHeight - 15);
      doc.setFontSize(9);
      doc.text(COMPANY_NAME, 14, pageHeight - 8);
      doc.text(`Page ${pageNumber} of ${pageCount}`, pageWidth - 14, pageHeight - 8, { align: 'right' });
    },
  });

  doc.save(`appointments_report_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  toast.success('Appointments report exported successfully');
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
      cell: ({ row }) => {
        const vehicle = row.original.vehicle;

        if (!vehicle) {
          return (
            <div className="text-muted-foreground text-xs">
              No vehicle assigned
            </div>
          );
        }

        return (
          <div>
            <div>
              {`${vehicle?.brand || '-'} ${vehicle?.model || '-'} (${vehicle?.year || '-'})`}
            </div>
            <div className="text-muted-foreground text-xs">
              {vehicle?.licensePlate || '-'}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'services',
      header: 'Services',
      cell: ({ row }) => {
        const services = row.original.services;

        if (!services || services.length === 0) {
          return (
            <div className="text-muted-foreground text-xs">
              No services listed
            </div>
          );
        }

        return (
          <div>
            {services.map((service, index) => (
              <div key={index}>
                {service?.service?.name || 'Unnamed Service'}
              </div>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: 'scheduledTime',
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Scheduled Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
  const value = row.getValue('scheduledTime');
  if (!value) return <div className="pl-4">-</div>;

  // Convert UTC time to user's local timezone
  const date = new Date(value);
  return (
    <div className="pl-4">
      {date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })}
    </div>
  );
},
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
              if (appointment.status === 'Canceled') return null; // No actions for canceled appointments
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

            <Button
              variant={'outline'}
              onClick={() => handleOpenProgress(appointment)}
            >
              Track
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
                <DropdownMenuItem onSelect={handleOpenInvoiceModal.bind(null, appointment._id)}>
                  View Invoice
                </DropdownMenuItem>
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
            <div className="flex items-end gap-4 mt-4">
            {/* LEFT: Status Filter and Prepared By */}
            <div className="flex items-end gap-2">
              {/* Status Filter */}
              <div>
                <Label>Status Filter</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-9 w-[140px]">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="All">All Appointments</SelectItem>
                      {status.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Prepared By */}
              <div>
                <Label>Prepared By</Label>
                <Input
                  value={preparedBy}
                  onChange={(e) => setPreparedBy(e.target.value)}
                  placeholder="Enter your name"
                  className="h-9 w-[180px]"
                />
              </div>
            </div>

            {/* RIGHT: Export Button */}
            <Button variant="outline" onClick={handleExportPDF} className="h-9 px-4">
              <Download className="h-4 w-4 mr-2" />
              Export to PDF
            </Button>
          </div>




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
              <DataTable columns={columns} data={filteredAppointments} className="flex-1" />
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
          <Dialog open={isModalInvoiceOpen} onOpenChange={setIsModalInvoiceOpen}>
            {isModalInvoiceOpen && (
              <div>
              <UploadInvoice
                appointmentId={selectedAppointment}
                onSave={handleUploadInvoice}
                onCancel={handleCloseInvoiceModal}
                setInvoiceFile={setInvoiceFile}
                adminPassword={adminPassword}
                setAdminPassword={setAdminPassword}
              />

              
            </div>
            )}
          </Dialog>
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

          <Dialog open={isProgressOpen} onOpenChange={setIsProgressOpen}>
            {isProgressOpen && (
              <AppointmentProgress appointment={progressAppointment} />
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
    </Tabs>

    // </DashboardLayout>
  );
};

export default AppointmentsPage;

