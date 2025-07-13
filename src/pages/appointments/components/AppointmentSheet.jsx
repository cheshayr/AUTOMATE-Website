import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Timer } from 'lucide-react';
import { status } from '../../../const/appointmentStatus';
import { useAuth } from '@/hooks/useAuth';
import { useAuthContext } from '@/context/AuthContext';

function AppointmentSheet({ appointment, onSave, onCancel, staffList = [], vehicleList = [] }) {
  const { user } = useAuthContext();
  const isAdmin = user?.role === 'admin';
  const form = useForm({
    defaultValues: {
      staffNotes: appointment.staffNotes,
      assignedStaff: appointment.assignedStaff?._id,
      status: appointment.status,
    },
  });

  console.log({ appointment });

  const scheduledDate = appointment?.scheduledDate
    ? new Date(appointment.scheduledDate).toISOString().split('T')[0]
    : '';
  const scheduledTime = appointment?.scheduledTime
    ? new Date(appointment.scheduledTime).toTimeString().slice(0, 5)
    : '';

  const serviceName = appointment.services?.[0].service?.name;

  console.log(serviceName);
  return (
    <SheetContent className={'flex flex-col'}>
      <SheetHeader className={'pb-0'}>
        <SheetTitle>Appointment Details</SheetTitle>
      </SheetHeader>
      <div className="flex-1 overflow-y-auto px-4">
        <Card className={'mb-4'}>
          <CardHeader className={'h-full'}>
            <div className="flex justify-between">
              <div className="flex flex-col">
                <CardTitle className={'mb-4'}>{serviceName}</CardTitle>
              </div>
              <Badge className={'text-xs h-4'}>{appointment.status}</Badge>
            </div>

            <CardDescription className={'space-y-2'}>
              <div className="flex justify-start gap-4">
                <div className="flex-1 h-full flex gap-2 justify-start">
                  <Calendar />
                  <div className="flex flex-col">
                    <Label>Date</Label>
                    <p>{scheduledDate}</p>
                  </div>
                </div>
                <div className="flex-1 h-full flex gap-2 justify-start">
                  <Timer />
                  <div className="flex flex-col">
                    <Label>Time</Label>
                    <p>{scheduledTime}</p>
                  </div>
                </div>
              </div>
              <div className="h-full flex  align-middle gap-2">
                <Label>Ref No.</Label>
                <p>{appointment.refNo || '-'}</p>
              </div>
              {appointment.customerNotes && (
                <div className="flex flex-col">
                  <Label>Customer Notes</Label>
                  <p>{appointment.customerNotes || '-'}</p>
                </div>
              )}
            </CardDescription>
          </CardHeader>
        </Card>
        <Form {...form} onSubmit={form.handleSubmit(onSave)}>
          <div className="mx-4">
            <div className="md:col-span-2 font-semibold text-primary mb-2">Customer Details</div>
            <div className=" grid grid-cols-2 gap-4 mb-4">
              <FormDetail label={'Full Name'} value={appointment.name} />
              <FormDetail label={'Phone Number'} value={appointment.phone} />
              <FormDetail label={'Email'} value={appointment.email} />
              <FormDetail label={'Contact Method'} value={appointment.contactMethod} />
              {/* <div className="md:col-span-2 font-semibold text-primary mb-4">Appointment Details</div> */}
              <div className="md:col-span-2 font-semibold text-primary mb-2">Vehicle Details</div>
              <FormDetail
                label={'Brand & Model'}
                value={`${appointment.vehicle?.brand} ${appointment.vehicle?.model} (${appointment.vehicle?.year})`}
              />
              <FormDetail label={'Plate Number'} value={appointment.vehicle?.plateNumber} />
            </div>
            <div className="space-y-4 mb-4">
              <div className="md:col-span-2 font-semibold text-primary mb-2">Internal Details</div>

              <FormField
                control={form.control}
                name="staffNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Staff Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="" {...field} disabled={!isAdmin} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assignedStaff"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign Staff</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!isAdmin}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a staff" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Staff</SelectLabel>
                            {staffList.map((staff) => (
                              <SelectItem key={staff._id} value={staff._id}>
                                {staff.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Update Status</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!isAdmin}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Select new status</SelectLabel>
                            {status.map((item) => (
                              <SelectItem key={item} value={item}>
                                {item}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </Form>
      </div>

      <SheetFooter>
        {isAdmin && (
          <Button onClick={form.handleSubmit(onSave)} type="submit">
            Save changes
          </Button>
        )}
        <SheetClose asChild>
          <Button variant="outline">Close</Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  );
}

export default AppointmentSheet;

function FormDetail({ label, value }) {
  return (
    <FormItem className={'flex flex-col justify-start'}>
      <FormLabel>{label}</FormLabel>
      <FormDescription className={'wrap-break-word'}>{value}</FormDescription>
    </FormItem>
  );
}
