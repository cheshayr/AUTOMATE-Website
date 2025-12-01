import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useGetServices } from '@/hooks/useDashboard.query';

export function ChartServices({ filter }) {
  const { data: services } = useGetServices(filter);

  // DEBUG: Check your browser console to see exactly what the API names the service field
  console.log("Service Data:", services?.data);

  const rawData = services?.data || [];

  // 1. DATA MAPPING
  // We map the API data to a standard format: { name: "Oil Change", count: 10 }
  // We try multiple common keys (name, serviceName, label) in case the API uses a different one.
  const chartData = rawData
    .map(item => ({
      name: item.name || item.serviceName || item.service || 'Unknown Service', 
      count: item.value || item.count || item.services || 0,
    }))
    .filter((item) => item.count > 0); // Remove 0 counts

  const chartConfig = {
    services: {
      label: 'Count',
      color: 'var(--chart-2)',
    },
  };

  const displayFilter = filter ? filter.charAt(0).toUpperCase() + filter.slice(1) : 'Monthly';

  return (
    <Card>
      <CardHeader>
        <CardTitle>{displayFilter} Services</CardTitle>
        <CardDescription>{services?.fromTo || 'Top Services'}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 0, // Reset margin, we control spacing via YAxis width
              right: 20
            }}
          >
            <CartesianGrid horizontal={false} />
            
            {/* Y-AXIS (Left Side): Shows the Service Names */}
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              axisLine={false}
              width={120} // <--- INCREASED WIDTH: This makes space for the names
              tick={{ fill: 'black', fontSize: 12 }} // Ensure text is visible
            />

            {/* X-AXIS (Bottom): Hidden, but type must be number for the bars to grow sideways */}
            <XAxis dataKey="count" type="number" hide />
            
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            
            <Bar dataKey="count" layout="vertical" fill="var(--color-services)" radius={4}>
              {/* Shows the number inside/next to the bar */}
              <LabelList 
                dataKey="count" 
                position="right" 
                offset={8} 
                className="fill-foreground" 
                fontSize={12} 
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

