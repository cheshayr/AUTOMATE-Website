import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  topAvailedServicesData,
  customerFeedbackData,
  vehicleHistoryData,
  revenueData
} from './mockReports.js';
import { FileText, TrendingUp, Users, Calendar as CalendarIcon, ChevronDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Switch } from '@/components/ui/switch.jsx';
import { useGenerateReportQuery } from '@/hooks/useReports.query.js';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar.jsx';
import { subDays } from 'date-fns';
import { ReportsTable } from './ReportsTable.jsx';

// ------------------- NEW MOCK DATA -------------------
const serviceTurnaroundData = [
  { serviceName: 'Oil Change', avgTime: '35 mins', fastest: '25 mins', slowest: '50 mins' },
  { serviceName: 'Brake Replacement', avgTime: '60 mins', fastest: '45 mins', slowest: '75 mins' },
];

const technicianPerformanceData = [
  { technicianName: 'John Doe', servicesCompleted: 12, avgTime: '40 mins', rating: 5 },
  { technicianName: 'Jane Smith', servicesCompleted: 8, avgTime: '45 mins', rating: 4.5 },
];

const partsUsageData = [
  { partName: 'Brake Pads', usedQuantity: 25, totalCost: 500 },
  { partName: 'Oil Filter', usedQuantity: 40, totalCost: 320 },
];

const inventorySummaryData = [
  { itemName: 'Engine Oil', beginningStock: 50, soldUsed: 12, addedStock: 10, remainingStock: 48 },
  { itemName: 'Brake Pad', beginningStock: 20, soldUsed: 5, addedStock: 0, remainingStock: 15 },
  { itemName: 'Tire', beginningStock: 10, soldUsed: 2, addedStock: 5, remainingStock: 13 },
];

// ------------------- PESO FORMAT FUNCTION -------------------
const formatPeso = (amount) => {
  if (!amount) return '₱0.00';
  if (typeof amount === 'string' && amount.startsWith('₱')) return amount; // already formatted
  return `₱${Number(amount).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const Reports = () => {
  const [reportType, setReportType] = useState('top-services');
  const [dateRange, setDateRange] = useState('weekly');
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const [dateFrom, setDateFrom] = useState(subDays(new Date(), 7));
  const [dateTo, setDateTo] = useState(new Date());
  const [dateFromOpen, setDateFromOpen] = useState(false);
  const [dateToOpen, setDateToOpen] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [isMockData, setIsMockData] = useState(false);
  const [preparedBy, setPreparedBy] = useState('');

  const {
    data: reportData,
    isLoading: reportIsLoading,
    isError: reportIsError,
    error: reportError,
    refetch: refetchReport,
  } = useGenerateReportQuery({ reportType, dateFrom, dateTo });

  const handleExportPDF = () => {
    if (!preparedBy.trim()) {
      toast.error("Please enter who prepared the report.");
      return;
    }
    console.log("Prepared By:", preparedBy);
    toast.success(`Exporting report (Prepared by: ${preparedBy})...`);
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
    setSelectedMonth((date.getMonth() + 1).toString().padStart(2, '0'));
  };

  const handleSelectMonthChange = (month) => {
    setSelectedMonth(month);
    const newDateFrom = new Date();
    newDateFrom.setMonth(parseInt(month) - 1);
    newDateFrom.setDate(1);
    setDateFrom(newDateFrom);
    setDateTo(new Date(newDateFrom.getFullYear(), newDateFrom.getMonth() + 1, 0));
  };

  const getReportConfig = () => {
    switch (reportType) {
      case 'repeat-customers':
        return {
          title: 'Repeat Customers Report',
          description: 'List of customers who have visited more than once',
          columns: [
            { key: 'customerName', label: 'Customer Name' },
            { key: 'visitCount', label: 'Number of Visits' },
            { key: 'lastVisit', label: 'Last Visit Date' },
          ],
          data: isMockData ? [] : reportData?.data || [],
          stats: [{ title: 'Total Repeat Customers', value: reportData?.data?.length || 0, icon: Users }],
        };

      case 'inventory-summary':
        return {
          title: 'Inventory Summary Report',
          description: 'Tracks stock movement, usage, and remaining inventory',
          columns: [
            { key: 'itemName', label: 'Item Name' },
            { key: 'beginningStock', label: 'Beginning Stock' },
            { key: 'soldUsed', label: 'Sold / Used' },
            { key: 'addedStock', label: 'Added Stock' },
            { key: 'remainingStock', label: 'Remaining Stock' },
          ],
          data: isMockData ? inventorySummaryData : reportData?.data || [],
          stats: [
            { title: 'Total Items', value: (isMockData ? inventorySummaryData.length : reportData?.data?.length || 0), icon: FileText },
          ],
        };

      case 'top-services':
        return {
          title: 'Top Availed Services Report',
          description: 'Most popular services and their performance',
          columns: [
            { key: 'serviceName', label: 'Service Name' },
            { key: 'timesAvailed', label: 'Times Availed' },
            { key: 'dateAvailed', label: 'Date Availed' },
          ],
          data: (isMockData ? topAvailedServicesData : reportData?.data || []).map(item => ({
            ...item,
            totalRevenue: formatPeso(item.totalRevenue),
          })),
          stats: [
            { title: 'Total Services', value: '457', icon: FileText },
            { title: 'Total Revenue', value: formatPeso(31425), icon: FileText },
            { title: 'Avg. per Service', value: formatPeso(68.72), icon: TrendingUp },
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
          data: (isMockData ? vehicleHistoryData : reportData?.data || []).map(item => ({
            ...item,
            serviceCost: formatPeso(item.serviceCost),
          })),
          stats: [
            { title: 'Services Completed', value: '189', icon: FileText },
            { title: 'In Progress', value: '12', icon: CalendarIcon },
            { title: 'Total Spent', value: formatPeso(18450), icon: FileText },
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
          data: (isMockData ? revenueData : reportData?.data || []).map(item => ({
            ...item,
            revenue: formatPeso(item.revenue),
          })),
          stats: [
            { title: 'Total Revenue', value: formatPeso(52350), icon: FileText, trend: { value: '12.5% from last period', isPositive: true } },
            { title: 'Services Completed', value: '891', icon: FileText },
            { title: 'Avg. Daily Revenue', value: formatPeso(1745), icon: TrendingUp },
          ],
        };

      case 'service-turnaround':
        return {
          title: 'Service Turnaround Report',
          description: 'Average, fastest, and slowest completion times for services',
          columns: [
            { key: 'serviceName', label: 'Service Name' },
            { key: 'avgTime', label: 'Average Completion Time' },
            { key: 'fastest', label: 'Fastest Time' },
            { key: 'slowest', label: 'Slowest Time' },
          ],
          data: isMockData ? serviceTurnaroundData : reportData?.data || [],
          stats: [],
        };

      case 'technician-performance':
        return {
          title: 'Technician Performance Report',
          description: 'Technician service completion and ratings',
          columns: [
            { key: 'technicianName', label: 'Technician Name' },
            { key: 'servicesCompleted', label: 'Services Completed' },
            
          ],
          data: isMockData ? technicianPerformanceData : reportData?.data || [],
          stats: [],
        };

      case 'parts-usage':
        return {
          title: 'Parts Usage Report',
          description: 'Most used parts and their cost',
          columns: [
            { key: 'partName', label: 'Part Name' },
            { key: 'usedQuantity', label: 'Quantity Used' },
            { key: 'totalCost', label: 'Total Cost' },
          ],
          data: (isMockData ? partsUsageData : reportData?.data || []).map(item => ({
            ...item,
            totalCost: formatPeso(item.totalCost),
          })),
          stats: [],
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
      <CardContent className="space-y-6">
        {/* FILTER CARD */}
        <Card className="w-full bg-transparent shadow-none">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Report Filter</CardTitle>
            <CardDescription className="line-clamp-3">Select report parameters and generate your report</CardDescription>
            <div className="space-y-2">
              <label className="text-sm font-medium">Prepared By</label>
              <input
                type="text"
                value={preparedBy}
                onChange={(e) => setPreparedBy(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-3 py-2 border rounded-md bg-background"
              />
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* MOCK DATA SWITCH */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex flex-col">
                <Label className="mb-2">Enable Mock Data</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Switch id="isMockData" checked={isMockData} onCheckedChange={setIsMockData} />
                  <Label htmlFor="isMockData">{isMockData ? 'Enabled' : 'Disabled'}</Label>
                </div>
              </div>
            </div>

            {/* REPORT TYPE AND DATE RANGE */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Type</label>
                <Select value={reportType} onValueChange={(value) => setReportType(value)}>
                  <SelectTrigger className={'w-full'}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="repeat-customers">Repeat Customers</SelectItem>
                    <SelectItem value="top-services">Top Availed Services</SelectItem>
                    <SelectItem value="customer-feedback">Customer Feedback</SelectItem>
                    <SelectItem value="vehicle-history">Vehicle History</SelectItem>
                    <SelectItem value="technician-performance">Technician Performance</SelectItem>
                    <SelectItem value="inventory-summary">Inventory Summary</SelectItem>
                    {/*<SelectItem value="service-turnaround">Service Turnaround</SelectItem> */}
                    {/* <SelectItem value="revenue">Revenue</SelectItem> */}
                    {/*<SelectItem value="parts-usage">Parts Usage</SelectItem> */}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <div className="flex space-x-2">
                  <Select value={dateRange} onValueChange={(value) => setDateRange(value)}>
                    <SelectTrigger className={'w-full'}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>

                  {dateRange === 'monthly' && (
                    <Select value={selectedMonth} onValueChange={(value) => handleSelectMonthChange(value)}>
                      <SelectTrigger className={'w-full'} disabled={dateRange !== 'monthly'}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                          <SelectItem key={month} value={month.toString().padStart(2, '0')}>
                            {new Date(0, month - 1).toLocaleString('default', { month: 'long' })}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>

              {/* Date From & To */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="dateFrom" className="px-1">Date From</Label>
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
                  <Label htmlFor="dateToOpen" className="px-1">Date To</Label>
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

        {/* REPORT TABLE */}
        {showReport && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                  dateFrom={dateFrom}
                  dateTo={dateTo}
                  preparedBy={preparedBy}
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
