import React, { useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Star, Download } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useAppointments } from '@/hooks/useAppointments.query';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format, parseISO, isValid } from 'date-fns';
import logo from '@/assets/logo.png';
import { toast } from 'sonner';

const Feedbacks = () => {
  const [filter, setFilter] = useState('All');
  const [preparedBy, setPreparedBy] = useState('');

  const { data, isPending } = useAppointments(filter);
  const appointments = data?.appointments || [];

  const handleExportPDF = () => {
    if (!preparedBy.trim()) {
      toast.error('Please enter who prepared the report.');
      return;
    }

    const doc = new jsPDF();
    const exportedAt = format(new Date(), 'MMM dd, yyyy • hh:mm a');

    doc.addImage(logo, 'PNG', 14, 10, 30, 30);
    doc.setFontSize(16);
    doc.text('Customer Feedback Report', 55, 20);

    doc.setFontSize(10);
    doc.text(`Rating Filter: ${filter === 'All' ? 'All Ratings' : `${filter} Star`}`, 14, 45);
    doc.text(`Prepared By: ${preparedBy}`, 14, 52);
    doc.text(`Exported On: ${exportedAt}`, 14, 58);

    autoTable(doc, {
      head: [['Customer', 'Service', 'Feedback', 'Rating', 'Date']],
      body: appointments.map((a) => [
        a.name || '-',
        a.services?.map((s) => s.service.name).join(', ') || '-',
        a.feedback?.comment || '-',
        a.feedback?.rating || '-',
        a.feedback?.createdAt && isValid(parseISO(a.feedback.createdAt))
          ? format(parseISO(a.feedback.createdAt), 'MMM dd, yyyy')
          : '-',
      ]),
      startY: 65,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [71, 85, 105] },
    });

    doc.save(`feedback_report_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    toast.success('Feedback report exported successfully');
  };

  return (
    <Card className="w-full bg-transparent shadow-none border-0">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Feedbacks</CardTitle>
        <CardDescription>View all users feedback from services.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* FILTERS */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        {/* LEFT */}
        <div className="space-y-2 min-w-[160px]">
          <Label>Rating Filter</Label>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="h-9">
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

        {/* RIGHT */}
        <div className="flex items-end gap-2">
          <div className="space-y-2">
            <Label>Prepared By</Label>
            <Input
              value={preparedBy}
              onChange={(e) => setPreparedBy(e.target.value)}
              placeholder="Enter your name"
              className="h-9 w-[200px]"
            />
          </div>

          <Button
            variant="outline"
            onClick={handleExportPDF}
            className="h-9 px-4"
          >
            <Download className="h-4 w-4 mr-2" />
            Export to PDF
          </Button>
        </div>
      </div>


        {/* TABLE */}
        <div className="rounded-lg border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>User</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Feedback</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isPending ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-40 text-center">
                    <LoadingSpinner />
                  </TableCell>
                </TableRow>
              ) : appointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No feedback available
                  </TableCell>
                </TableRow>
              ) : (
                appointments.map((appointment) => (
                  <TableRow key={appointment._id}>
                    <TableCell className="font-medium">{appointment.name}</TableCell>
                    <TableCell>
                      {appointment.services?.map((s) => s.service.name).join(', ') || 'N/A'}
                    </TableCell>
                    <TableCell>{appointment.feedback?.comment || '-'}</TableCell>
                    <TableCell>
                      {appointment.feedback?.rating ? (
                        <div className="flex">
                          {Array.from({ length: appointment.feedback.rating }).map((_, i) => (
                            <Star key={i} size={16} className="fill-yellow-400 stroke-0" />
                          ))}
                        </div>
                      ) : (
                        'Not rated'
                      )}
                    </TableCell>
                    <TableCell>
                      {appointment.feedback?.createdAt &&
                      isValid(parseISO(appointment.feedback.createdAt))
                        ? format(parseISO(appointment.feedback.createdAt), 'MMM dd, yyyy')
                        : '-'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default Feedbacks;
