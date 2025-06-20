import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// --- Appointment Form Component (for Add/Edit) ---
const AppointmentForm = ({ appointment, onSave, onCancel, staffList = [], vehicleList = [] }) => {
  const [formData, setFormData] = useState({
    name: appointment?.name || '',
    phone: appointment?.phone || '',
    email: appointment?.email || '',
    contactMethod: appointment?.contactMethod || 'Phone',
    vehicle: appointment?.vehicle || {},
    scheduledDate: appointment?.scheduledDate ? new Date(appointment.scheduledDate).toISOString().split('T')[0] : '',
    scheduledTime: appointment?.scheduledTime ? new Date(appointment.scheduledTime).toTimeString().slice(0, 5) : '',
    status: appointment?.status || 'Booked',
    assignedStaff: String(
      typeof appointment?.assignedStaff === 'object' ? appointment.assignedStaff._id : appointment?.assignedStaff || ''
    ),
    customerNotes: appointment?.customerNotes || '',
    staffNotes: appointment?.staffNotes || '',
  });

  const isEditMode = !!appointment;

  useEffect(() => {
    if (appointment) {
      setFormData({
        name: appointment?.name || '',
        phone: appointment?.phone || '',
        email: appointment?.email || '',
        contactMethod: appointment?.contactMethod || 'Phone',
        vehicle: appointment?.vehicle || {},
        scheduledDate: appointment?.scheduledDate
          ? new Date(appointment.scheduledDate).toISOString().split('T')[0]
          : '',
        scheduledTime: appointment?.scheduledTime ? new Date(appointment.scheduledTime).toTimeString().slice(0, 5) : '',
        status: appointment?.status || 'Booked',
        assignedStaff: String(
          typeof appointment?.assignedStaff === 'object'
            ? appointment.assignedStaff._id
            : appointment?.assignedStaff || ''
        ),
        customerNotes: appointment?.customerNotes || '',
        staffNotes: appointment?.staffNotes || '',
      });
    }
  }, [appointment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <DialogContent className={'h-auto max-h-[90vh] flex flex-col justify-between'}>
      <DialogHeader>
        <DialogTitle className={''}>{isEditMode ? 'Edit Appointment' : 'Create New Appointment'}</DialogTitle>
        <DialogDescription>
          {isEditMode
            ? 'Update the details for this appointment.'
            : 'Fill out the form below to book a new appointment.'}
        </DialogDescription>
      </DialogHeader>
      <DialogDescription asChild className={'h-[70%] overflow-y-scroll'}>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 font-semibold text-primary">Customer Details</div>
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="contactMethod">Preferred Contact Method</Label>
            <select
              id="contactMethod"
              name="contactMethod"
              value={formData.contactMethod}
              onChange={handleChange}
              className="flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            >
              <option value="Phone">Phone Call</option>
              <option value="Email">Email</option>
              <option value="SMS">SMS Text</option>
            </select>
          </div>
          <div className="md:col-span-2 font-semibold text-primary mt-4">Appointment Details</div>
          <div>
            <Label htmlFor="vehicle">Vehicle</Label>
            <Input
              id="vehicle"
              name="vehicle"
              type="text"
              value={`${formData.vehicle.brand} ${formData.vehicle.model} (${formData.vehicle.plateNumber})`}
              onChange={handleChange}
              readOnly
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            >
              <option>Booked</option>
              <option>Vehicle Arrived</option>
              <option>Assessment</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>
          <div>
            <Label htmlFor="scheduledDate">Date</Label>
            <Input
              id="scheduledDate"
              name="scheduledDate"
              type="date"
              value={formData.scheduledDate}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="scheduledTime">Time</Label>
            <Input
              id="scheduledTime"
              name="scheduledTime"
              type="time"
              value={formData.scheduledTime}
              onChange={handleChange}
              required
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="customerNotes">Customer Notes</Label>
            <Textarea id="customerNotes" name="customerNotes" value={formData.customerNotes} onChange={handleChange} />
          </div>

          {isEditMode && (
            <>
              <div className="md:col-span-2 font-semibold text-primary mt-4">Internal Details</div>
              <div>
                <Label htmlFor="assignedStaff">Assign Staff</Label>
                <select
                  id="assignedStaff"
                  name="assignedStaff"
                  value={formData.assignedStaff}
                  onChange={handleChange}
                  className="flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                >
                  <option value="">Unassigned</option>
                  {staffList?.map((staff) => (
                    <option key={staff._id} value={String(staff._id)}>
                      {`${staff.name} (${staff.position})`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="staffNotes">Staff Notes</Label>
                <Textarea id="staffNotes" name="staffNotes" value={formData.staffNotes} onChange={handleChange} />
              </div>
            </>
          )}

          <DialogFooter className="md:col-span-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogDescription>
    </DialogContent>
  );
};

export default AppointmentForm;
