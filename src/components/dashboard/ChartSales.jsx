'use client';

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useGetSales } from '@/hooks/useDashboard.query';

export function ChartSales({ filter }) {
  const { data: sales } = useGetSales(filter);

  // 1. Filter out zero sales
  const chartData = (sales?.data || []).filter(item => item.sales > 0);

  // 2. Calculate the Max and Mid lines based on your "Round Up" logic
  const maxSaleValue = Math.max(...chartData.map((d) => d.sales), 0);
  
  let domainMax = 0;
  let midLine = 0;

  if (maxSaleValue > 0) {
    const rawMid = maxSaleValue / 2;
    
    // Determine magnitude (e.g., is it in the 100s, 1000s, etc?)
    // This helps us decide whether to round to the nearest 100 or 1000.
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawMid)));
    
    // Round the mid value UP to the nearest magnitude
    // Example: 3760 -> Magnitude 1000 -> 3.76 -> Ceil 4 -> 4000
    midLine = Math.ceil(rawMid / magnitude) * magnitude;
    
    // If the rounded mid is exactly the raw mid (unlikely with "next even"), 
    // we force a step up to ensure clean lines if needed, but usually Ceil handles it.
    
    domainMax = midLine * 2;
  }

  const chartConfig = {
    sales: {
      label: 'Sales',
      color: 'var(--chart-1)',
    },
  };

  const displayFilter = filter ? filter.charAt(0).toUpperCase() + filter.slice(1) : 'Monthly';

  // Currency Formatter
  const formatCurrency = (value) => `₱${value.toLocaleString()}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{displayFilter} Sales</CardTitle>
        <CardDescription>{sales?.fromTo || 'Sales Overview'}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              left: 10, // Added margin for the YAxis labels
            }}
          >
            <CartesianGrid vertical={false} />
            
            {/* XAxis: Removed labels (hide={true}) but kept dataKey for mapping */}
            <XAxis
              dataKey="month" // or "date" depending on API
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              hide={true} 
            />

            {/* YAxis: Added Custom Scale and Ticks */}
            <YAxis 
              axisLine={false}
              tickLine={false}
              tickCount={3} // 0, Mid, Max
              domain={[0, domainMax]}
              ticks={[0, midLine, domainMax]}
              tickFormatter={formatCurrency}
              width={60} // Width to fit the currency text
            />

            <ChartTooltip 
              cursor={false} 
              content={<ChartTooltipContent hideLabel formatter={(value) => formatCurrency(value)} />} 
            />
            
            <Bar dataKey="sales" fill="var(--color-sales)" radius={8}>
              <LabelList 
                position="top" 
                offset={12} 
                className="fill-foreground" 
                fontSize={12} 
                formatter={formatCurrency}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
