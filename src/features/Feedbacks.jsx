import React, { useEffect, useState } from 'react';

import LoadingSpinner from '@/components/LoadingSpinner';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Star } from 'lucide-react';
import { Label } from 'recharts';
import { useFetchInventory, useFetchItemCategories } from '@/hooks/useInventoryQuery';
import { useDebounce } from '@uidotdev/usehooks';
import { useAppointments } from '@/hooks/useAppointments.query';

const feedbacks = [
  {
    user: 'John Dela Cruz',
    service: 'IT Consultation',
    details: 'Resolved network connectivity issues for the main office.',
    rate: 3,
    date: '2025-06-20T14:30:00',
  },
  {
    user: 'Maria Santos',
    service: 'Graphic Design',
    details: 'Created a new set of social media marketing banners.',
    rate: 3,
    date: '2025-06-19T11:00:00',
  },
  {
    user: 'Michael Reyes',
    service: 'Web Development',
    details: 'Deployed the final version of the e-commerce checkout page.',
    rate: 4,
    date: '2025-06-18T17:45:00',
  },
  {
    user: 'Angela Garcia',
    service: 'Content Writing',
    details: 'Wrote and submitted four 500-word articles on tech trends.',
    rate: 5,
    date: '2025-06-16T18:00:00',
  },
];

const Feedbacks = () => {
  const [filter, setFilter] = useState('All');

  const { data, isPending, isSuccess, isError } = useAppointments(filter);

  console.log(data);

  return (
    <>
      <Card className="w-full bg-transparent shadow-none border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Feedbacks</CardTitle>
          <CardDescription className="line-clamp-3">View all users feedback from services.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex mb-4 justify-between">
            <div className="w-[50%]"></div>
            <div className="space-x-4 flex">
              <div className="grid gap-3 min-w-36">
                <Label htmlFor="category">Item Category</Label>
                <Select id="category" name="category" value={filter} onValueChange={(newValue) => setFilter(newValue)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="All">All</SelectItem>
                      <SelectItem value="1">1 Star</SelectItem>
                      <SelectItem value="2">2 Star</SelectItem>
                      <SelectItem value="3">3 Star</SelectItem>
                      <SelectItem value="4">4 Star</SelectItem>
                      <SelectItem value="5">5 Star</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User </TableHead>
                <TableHead>Service </TableHead>
                <TableHead>Feedback</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="">
              {isPending ? (
                <TableCell colSpan={6} className="h-96 ">
                  <div className="flex items-center justify-center w-full h-full ">
                    <LoadingSpinner />
                  </div>
                </TableCell>
              ) : (
                data?.appointments?.map((appointment) => (
                  <TableRow key={appointment._id}>
                    <TableCell className="font-medium">{appointment.name}</TableCell>
                    <TableCell>
                      {appointment.services?.map((service) => service.service.name).join(', ') ?? 'N/A'}
                    </TableCell>
                    <TableCell>{appointment?.feedback?.comment || ''}</TableCell>

                    <TableCell className="flex ">
                      {appointment.feedback?.rating
                        ? Array.from({ length: appointment.feedback?.rating }).map((_, index) => (
                            <Star key={index} size={24} className="fill-yellow-500 stroke-0" />
                          ))
                        : 'Not yet rated.'}
                    </TableCell>
                    <TableCell>{appointment?.feedback?.createdAt || ''}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

export default Feedbacks;
