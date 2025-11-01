import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { topAvailedServicesData, customerFeedbackData, vehicleHistoryData, revenueData } from './mockReports.js';
import { FileText, TrendingUp, Users, DollarSign, Calendar as CalendarIcon, ChevronDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { ReportsTable } from './ReportsTable.jsx';
import { Switch } from '@/components/ui/switch.jsx';
import { useGenerateReportQuery } from '@/hooks/useReports.query.js';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar.jsx';
import { subDays } from 'date-fns';
const Reports = () => {
  const [reportType, setReportType] = useState('top-services');
  const [dateRange, setDateRange] = useState('weekly');
  const [dateFrom, setDateFrom] = useState(subDays(new Date(), 7));
  const [dateTo, setDateTo] = useState(new Date());
  const [dateFromOpen, setDateFromOpen] = useState(false);
  const [dateToOpen, setDateToOpen] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [isMockData, setIsMockData] = useState(false);
  // const [reportConfig, setReportConfig] = useState({});

  const {
    data: reportData,
    isLoading: reportIsLoading,
    isError: reportIsError,
    error: reportError,
    refetch: refetchReport,
  } = useGenerateReportQuery({ reportType, dateFrom, dateTo });

  console.log({ reportData });
  const handleExportPDF = () => {
    toast.success('Exporting report to PDF...');
  };

  const handleDateFromChange = (date) => {
    if (dateRange === 'weekly') {
      const newDateTo = new Date(date);
      newDateTo.setDate(newDateTo.getDate() + 7);
      setDateTo(newDateTo);
    }

    if (dateRange === 'monthly') {
      const newDateTo = new Date(date);
      newDateTo.setMonth(newDateTo.getMonth() + 1);
      setDateTo(newDateTo);
    }

    setDateFrom(date);
  };

  const getReportConfig = () => {
    switch (reportType) {
      case 'top-services':
        return {
          title: 'Top Availed Services Report',
          description: 'Most popular services and their performance',
          columns: [
            { key: 'serviceName', label: 'Service Name' },
            { key: 'timesAvailed', label: 'Times Availed' },
            { key: 'totalRevenue', label: 'Total Revenue' },
            { key: 'dateAvailed', label: 'Date Availed' },
          ],
          data: isMockData ? topAvailedServicesData : reportData?.data || [],
          stats: [
            { title: 'Total Services', value: '457', icon: FileText },
            { title: 'Total Revenue', value: '$31,425', icon: DollarSign },
            { title: 'Avg. per Service', value: '$68.72', icon: TrendingUp },
          ],
        };
      case 'customer-feedback':
        return {
          title: 'Customer Feedback Report',
          description: 'Customer ratings and reviews',
          columns: [
            { key: 'name', label: 'Customer Name' },
            { key: 'serviceName', label: 'Service Availed' },
            { key: 'assignedStaff', label: 'Technician' },
            { key: 'feedbackRating', label: 'Rating', sortable: false },
            { key: 'feedbackComment', label: 'Comments' },
            { key: 'feedbackDate', label: 'Date Submitted' },
          ],
          data: isMockData ? customerFeedbackData : reportData?.data || [],
          stats: [
            { title: 'Total Feedback', value: '234', icon: Users },
            { title: 'Avg. Rating', value: '4.7/5', icon: TrendingUp },
            { title: 'Response Rate', value: '89%', icon: FileText },
          ],
        };
      case 'vehicle-history':
        return {
          title: 'Vehicle History Report',
          description: 'Complete service history records',
          columns: [
            { key: 'serviceDate', label: 'Service Date' },
            { key: 'plateNumber', label: 'Plate #' },
            { key: 'vehicle', label: 'Vehicle' },
            { key: 'serviceName', label: 'Service Name' },
            { key: 'technicianName', label: 'Technician' },
            { key: 'serviceCost', label: 'Service Cost' },
            { key: 'remarks', label: 'Remarks/Notes' },
            { key: 'status', label: 'Status' },
          ],
          data: isMockData ? vehicleHistoryData : reportData?.data || [],
          stats: [
            { title: 'Services Completed', value: '189', icon: FileText },
            { title: 'In Progress', value: '12', icon: CalendarIcon },
            { title: 'Total Spent', value: '$18,450', icon: DollarSign },
          ],
        };
      case 'revenue':
        return {
          title: 'Revenue Report',
          description: 'Financial performance overview',
          columns: [
            { key: 'date', label: 'Date/Period' },
            { key: 'servicesCompleted', label: 'Services Completed' },
            { key: 'revenue', label: 'Revenue' },
            { key: 'topServices', label: 'Top Services' },
          ],
          data: isMockData ? revenueData : reportData?.data || [],
          stats: [
            {
              title: 'Total Revenue',
              value: '$52,350',
              icon: DollarSign,
              trend: { value: '12.5% from last period', isPositive: true },
            },
            { title: 'Services Completed', value: '891', icon: FileText },
            { title: 'Avg. Daily Revenue', value: '$1,745', icon: TrendingUp },
          ],
        };
    }
  };

  const handleGenerateReport = () => {
    refetchReport();
    setShowReport(true);
    toast.success('Report generated successfully!');
  };

  const reportConfig = getReportConfig();

  return (
    <Card className="w-full bg-transparent shadow-none border-0">
      {/* <CardHeader>
        <CardTitle className="text-2xl font-semibold">Reports</CardTitle>
        <CardDescription className="line-clamp-3">
          Select report types, date ranges, and export formats to generate comprehensive reports for analysis.
        </CardDescription>
      </CardHeader> */}
      <CardContent className="space-y-6">
        <Card className="w-full bg-transparent shadow-none">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Report Filter</CardTitle>
            <CardDescription className="line-clamp-3">
              Select report parameters and generate your report
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex flex-col">
                <Label className="mb-2">Enable Mock Data</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Switch id="isMockData" checked={isMockData} onCheckedChange={setIsMockData} />
                  <Label htmlFor="isMockData">{isMockData ? 'Enabled' : 'Disabled'}</Label>
                </div>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Type</label>
                <Select value={reportType} onValueChange={(value) => setReportType(value)}>
                  <SelectTrigger className={'w-full'}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="top-services">Top Availed Services</SelectItem>
                    <SelectItem value="customer-feedback">Customer Feedback</SelectItem>
                    <SelectItem value="vehicle-history">Vehicle History</SelectItem>
                    <SelectItem value="revenue">Revenue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <Select value={dateRange} onValueChange={(value) => setDateRange(value)}>
                  <SelectTrigger className={'w-full'}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="dateFrom" className="px-1">
                    Date From
                  </Label>
                  <Popover open={dateFromOpen} onOpenChange={setDateFromOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" id="dateFrom" className="w-full justify-between font-normal">
                        {dateFrom ? dateFrom.toLocaleDateString() : 'Select date'}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateFrom}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                          handleDateFromChange(date);
                          setDateFromOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateToOpen" className="px-1">
                    Date To
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" id="dateToOpen" className="w-full justify-between font-normal" disabled>
                        {dateTo ? dateTo.toLocaleDateString() : 'Select date'}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                      <Calendar mode="single" selected={dateTo} captionLayout="dropdown" />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="flex items-end">
                <Button onClick={handleGenerateReport} className="w-full">
                  Generate Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {showReport && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* <div className="grid gap-4 md:grid-cols-3">
              {reportConfig.stats.map((stat, idx) => (
                <StatCard key={idx} {...stat} />
              ))}
            </div> */}

            <Card>
              <CardHeader>
                <CardTitle>{reportConfig.title}</CardTitle>
                <CardDescription>{reportConfig.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ReportsTable
                  reportTitle={reportConfig.title}
                  columns={reportConfig.columns}
                  data={reportConfig.data}
                  onExportPDF={handleExportPDF}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Reports;
