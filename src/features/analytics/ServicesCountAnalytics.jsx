// 'use client';

// import * as React from 'react';
// import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
// import { useFetchServicesAnalytics } from '@/hooks/useAnalytticsQuery';

// export const description = 'An interactive line chart';

// const chartData = [
//   { date: '2024-04-01', desktop: 222, mobile: 150 },
//   { date: '2024-04-02', desktop: 97, mobile: 180 },
//   { date: '2024-04-03', desktop: 167, mobile: 120 },
//   { date: '2024-04-04', desktop: 242, mobile: 260 },
//   { date: '2024-04-05', desktop: 373, mobile: 290 },
//   { date: '2024-04-06', desktop: 301, mobile: 340 },
//   { date: '2024-04-07', desktop: 245, mobile: 180 },
//   { date: '2024-04-08', desktop: 409, mobile: 320 },
//   { date: '2024-04-09', desktop: 59, mobile: 110 },
//   { date: '2024-04-10', desktop: 261, mobile: 190 },
//   { date: '2024-04-11', desktop: 327, mobile: 350 },
//   { date: '2024-04-12', desktop: 292, mobile: 210 },
//   { date: '2024-04-13', desktop: 342, mobile: 380 },
// ];

// const chartConfig = {
//   views: {
//     label: 'Page Views',
//   },
//   desktop: {
//     label: 'Desktop',
//     color: 'var(--chart-1)',
//   },
//   mobile: {
//     label: 'Mobile',
//     color: 'var(--chart-2)',
//   },
// };

// export function ServicesCountAnalytics() {
//   const [activeChart, setActiveChart] = React.useState('desktop');

//   const { data, isPening, isSuccess } = useFetchServicesAnalytics();

//   const chartConfig1 = data?.data;

//   const total = React.useMemo(
//     () => ({
//       desktop: chartData.reduce((acc, curr) => acc + curr.desktop, 0),
//       mobile: chartData.reduce((acc, curr) => acc + curr.mobile, 0),
//     }),
//     []
//   );

//   return (
//     <Card className="py-4 sm:py-0 shadow-none h-full">
//       <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
//         <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0 w-3/12">
//           <CardTitle>Services Insights</CardTitle>
//           <CardDescription> Showing lifetime total availed services by customers</CardDescription>
//         </div>
//         <div className="flex overflow-auto w-9/12">
//           {['desktop', 'mobile'].map((key) => {
//             const chart = key;
//             return (
//               <button
//                 key={chart}
//                 data-active={activeChart === chart}
//                 className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
//                 onClick={() => setActiveChart(chart)}
//               >
//                 <span className="text-muted-foreground text-xs"> {chartConfig[chart].label}</span>
//                 <span className="text-lg leading-none font-bold sm:text-3xl">
//                   {/* Removed the type assertion for `key` */} {total[key].toLocaleString()}
//                 </span>
//
//               </button>
//             );
//           })}
//         </div>
//       </CardHeader>
//       <CardContent className="px-2 sm:p-6">
//         <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
//           <LineChart
//             accessibilityLayer
//             data={chartData}
//             margin={{
//               left: 12,
//               right: 12,
//             }}
//           >
//             <CartesianGrid vertical={false} />
//             <XAxis
//               dataKey="date"
//               tickLine={false}
//               axisLine={false}
//               tickMargin={8}
//               minTickGap={32}
//               tickFormatter={(value) => {
//                 const date = new Date(value);
//                 return date.toLocaleDateString('en-US', {
//                   month: 'short',
//                   day: 'numeric',
//                 });
//               }}
//             />
//             <ChartTooltip
//               content={
//                 <ChartTooltipContent
//                   className="w-[150px]"
//                   nameKey="views"
//                   labelFormatter={(value) => {
//                     return new Date(value).toLocaleDateString('en-US', {
//                       month: 'short',
//                       day: 'numeric',
//                       year: 'numeric',
//                     });
//                     __;
//                   }}
//                 />
//               }
//             />
//             <Line
//               dataKey={activeChart}
//               type="monotone"
//               stroke={`var(--color-${activeChart})`}
//               strokeWidth={2}
//               dot={false}
//             />
//           </LineChart>
//         </ChartContainer>
//       </CardContent>
//     </Card>
//   );
// }
'use client';

import * as React from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { Calendar, X, Download } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useFetchServicesAnalytics, useFetchAnalyticsInsights } from '@/hooks/useAnalytticsQuery';
import { Skeleton } from '@/components/ui/skeleton'; // For loading state
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { exportAnalyticsToPDF } from '@/utils/analyticsExportPdf';

export function ServicesCountAnalytics({ 
  dateRange = {}, 
  setDateRange = () => {},
  preparedBy = '',
  setPreparedBy = () => {}
}) {
  // 1. Fetch data using your custom hook
  const { data: apiResponse, isPending, isSuccess } = useFetchServicesAnalytics(dateRange);

  // Fetch AI insights
  const { data: insightsData } = useFetchAnalyticsInsights(dateRange);

  // Filter data based on selected date range
  const filteredChartData = React.useMemo(() => {
    if (!apiResponse?.data) return [];

    if (!dateRange.from && !dateRange.to) {
      return apiResponse.data;
    }

    return apiResponse.data.filter((item) => {
      const itemDate = new Date(item.date);
      const fromDate = dateRange.from ? new Date(dateRange.from) : null;
      const toDate = dateRange.to ? new Date(dateRange.to) : null;

      if (fromDate && itemDate < fromDate) return false;
      if (toDate) {
        const nextDay = new Date(toDate);
        nextDay.setDate(nextDay.getDate() + 1);
        if (itemDate >= nextDay) return false;
      }
      return true;
    });
  }, [apiResponse?.data, dateRange]);

  
  const { chartConfig, serviceNames, chartData } = React.useMemo(() => {
    const data = filteredChartData;

    if (data.length === 0) {
      return { chartConfig: {}, serviceNames: [], chartData: [] };
    }

    // Get all keys from the first data object, excluding 'date', to use as service names
    const discoveredServiceNames = Object.keys(data[0]).filter((key) => key !== 'date');

    // Define a list of colors for the chart lines
    const chartColors = ['--chart-1', '--chart-2', '--chart-3', '--chart-4', '--chart-5'];

    // Build the configuration object for the ChartContainer
    const dynamicChartConfig = discoveredServiceNames.reduce((config, name, index) => {
      config[name] = {
        label: name, // Use the service name as the label
        color: `var(${chartColors[index % chartColors.length]})`, // Cycle through colors
      };
      return config;
    }, {});

    
    dynamicChartConfig['combined'] = {
      label: 'All Metrics',
      color: `var(--chart-1)`,
    };

    return {
      chartConfig: dynamicChartConfig,
      serviceNames: ['combined', ...discoveredServiceNames],
      chartData: data,
    };
  }, [filteredChartData]);

  // 3. Manage the active chart state, initializing it once data is available
  const [activeChart, setActiveChart] = React.useState(null);

  React.useEffect(() => {
  
    if (serviceNames.length > 0 && !activeChart) {
      setActiveChart('combined');
    }
  }, [serviceNames, activeChart]); // Dependencies ensure this runs at the right time

  // 4. Calculate totals dynamically based on the fetched data
  const totals = React.useMemo(() => {
    if (!chartData || chartData.length === 0) {
      return {};
    }

    // Calculate the total for each service
    const serviceTotals = serviceNames.filter(name => name !== 'combined').reduce((acc, name) => {
      acc[name] = chartData.reduce((sum, entry) => sum + (entry[name] || 0), 0);
      return acc;
    }, {});

    // Calculate combined total
    const combinedTotal = Object.values(serviceTotals).reduce((sum, val) => sum + val, 0);
    
    return {
      combined: combinedTotal,
      ...serviceTotals,
    };
  }, [chartData, serviceNames]); // Re-calculate if data or service names change

  // PDF Export
  const handleExportPDF = () => {
    exportAnalyticsToPDF({
      chartData,
      dateRange,
      preparedBy,
      serviceNames,
      activeChart,
      insights: insightsData,
    });
  };

  // 5. Handle loading and empty states before rendering the main component
  if (isPending) {
    return (
      <Card className="py-4 sm:py-0 shadow-none h-full">
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-[250px] mt-4" />
        </CardContent>
      </Card>
    );
  }

  if (isSuccess && (!chartData || chartData.length === 0)) {
    
    return (
      <Card className="py-4 sm:py-0 sm:pt-4 shadow-none h-full">
        <CardHeader className="flex flex-col items-stretch !p-0 sm:border-b">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 pb-3">
            <div className="flex flex-1 flex-col justify-center gap-1">
              <CardTitle>Services Insights</CardTitle>
              <CardDescription>Showing lifetime total availed services by customers</CardDescription>
            </div>
            
            {/* Date Range Picker Button */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 w-fit"
                  title="Filter by date range"
                >
                  <Calendar className="h-4 w-4" />
                  {dateRange.from && dateRange.to ? (
                    <span className="text-xs">
                      {dateRange.from.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {dateRange.to.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  ) : (
                    <span className="text-xs">Filter dates</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 flex flex-col" align="end">
                <div className="p-4 border-b">
                  <h3 className="text-sm font-semibold mb-3">Select Date Range</h3>
                  <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">From</label>
                    <CalendarComponent
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) =>
                        setDateRange({ ...dateRange, from: date })
                      }
                      disabled={(date) =>
                        dateRange.to ? date > dateRange.to : false
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">To</label>
                    <CalendarComponent
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date) =>
                        setDateRange({ ...dateRange, to: date })
                      }
                      disabled={(date) =>
                        dateRange.from ? date < dateRange.from : false
                      }
                    />
                  </div>
                </div>
                </div>
                <div className="flex gap-2 p-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDateRange({ from: null, to: null })}
                    className="flex-1"
                  >
                    Clear
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex overflow-auto w-full border-t">
            {/* Show tabs even when no data */}
            {apiResponse?.data && apiResponse.data.length > 0 && serviceNames.map((serviceKey) => (
              <button
                key={serviceKey}
                data-active={activeChart === serviceKey}
                className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(serviceKey)}
              >
                <span className="text-muted-foreground text-xs"> {chartConfig[serviceKey]?.label}</span>
                <span className="text-lg leading-none font-bold sm:text-3xl">
                  {(totals[serviceKey] || 0).toLocaleString()}
                </span>
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6 flex items-center justify-center min-h-[250px]">
          <div className="text-center">
            {dateRange.from || dateRange.to ? (
              <p className="text-muted-foreground">No services data available for the selected date range.</p>
            ) : (
              <p className="text-muted-foreground">No services data available yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Ensure we don't render the chart until an active line is selected
  if (!activeChart) {
    return null; // or a loading indicator
  }

  return (
    <Card className="py-4 sm:py-0 sm:pt-4 shadow-none h-full">
      <CardHeader className="flex flex-col items-stretch !p-0 sm:border-b">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 pb-3">
          <div className="flex flex-1 flex-col justify-center gap-1">
            <CardTitle>Services Insights</CardTitle>
            <CardDescription>Showing lifetime total availed services by customers</CardDescription>
          </div>
          
          {/* Date Range Picker Button */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 w-fit"
                title="Filter by date range"
              >
                <Calendar className="h-4 w-4" />
                {dateRange.from && dateRange.to ? (
                  <span className="text-xs">
                    {dateRange.from.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {dateRange.to.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                ) : (
                  <span className="text-xs">Filter dates</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 flex flex-col" align="end">
              <div className="p-4 border-b">
                <h3 className="text-sm font-semibold mb-3">Select Date Range</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">From</label>
                    <CalendarComponent
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) =>
                        setDateRange({ ...dateRange, from: date })
                      }
                      disabled={(date) =>
                        dateRange.to ? date > dateRange.to : false
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">To</label>
                    <CalendarComponent
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date) =>
                        setDateRange({ ...dateRange, to: date })
                      }
                      disabled={(date) =>
                        dateRange.from ? date < dateRange.from : false
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2 p-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDateRange({ from: null, to: null })}
                  className="flex-1"
                >
                  Clear
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          {/* Export PDF Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPDF}
            disabled={!preparedBy || preparedBy.trim() === ''}
            className="gap-1.5 w-fit"
            title={preparedBy ? "Export to PDF" : "Enter a name in 'Prepared By' to export"}
          >
            <Download className="h-4 w-4" />
            <span className="text-xs">Export PDF</span>
          </Button>
        </div>

        <div className="flex overflow-auto w-full border-t">
          {/* Dynamically render a button for each service */}
          {serviceNames.map((serviceKey) => (
            <button
              key={serviceKey}
              data-active={activeChart === serviceKey}
              className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
              onClick={() => setActiveChart(serviceKey)}
            >
              <span className="text-muted-foreground text-xs"> {chartConfig[serviceKey]?.label}</span>
              <span className="text-lg leading-none font-bold sm:text-3xl">
                {(totals[serviceKey] || 0).toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              label={{ value: 'Date', position: 'insideBottomRight', offset: -5 }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <YAxis
              label={{ value: 'Number of Services', angle: -90, position: 'insideLeft' }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  }
                />
              }
            />
            {/* */}
            {activeChart === 'combined' 
              ? serviceNames
                  .filter(name => name !== 'combined')
                  .map((serviceName) => (
                    <Line
                      key={serviceName}
                      dataKey={serviceName}
                      type="monotone"
                      stroke={chartConfig[serviceName]?.color}
                      strokeWidth={2}
                      dot={false}
                    />
                  ))
              : <Line
                  dataKey={activeChart}
                  type="monotone"
                  stroke={chartConfig[activeChart]?.color}
                  strokeWidth={2}
                  dot={false}
                />
            }
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
