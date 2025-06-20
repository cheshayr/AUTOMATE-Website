'use client';

import React, { useMemo, useState } from 'react';

import { Label, Pie, PieChart, Sector } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartStyle, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFetchFeedbackAnalytics } from '@/hooks/useAnalytticsQuery';

export const description = 'An interactive pie chart';

// Removed the `satisfies ChartConfig` operator
const chartConfig = {
  star1: {
    label: '1 Star',
    color: 'var(--chart-1)',
  },
  star2: {
    label: '2 Star',
    color: 'var(--chart-2)',
  },
  star3: {
    label: '3 Star',
    color: 'var(--chart-3)',
  },
  star4: {
    label: '4 Star',
    color: 'var(--chart-4)',
  },
  star5: {
    label: '5 Star',
    color: 'var(--chart-5)',
  },
};

export function FeedbacksAnalytics() {
  //   const countData = [
  //     { month: 'star1', count: 186, fill: 'var(--color-star1)' },
  //     { month: 'star2', count: 305, fill: 'var(--color-star2)' },
  //     { month: 'star3', count: 237, fill: 'var(--color-star3)' },
  //     { month: 'star4', count: 173, fill: 'var(--color-star4)' },
  //     { month: 'star5', count: 209, fill: 'var(--color-star5)' },
  //   ];
  const { data, isPending, isSuccess } = useFetchFeedbackAnalytics();
  console.log(data?.data);

  const countData = data?.data;

  const id = 'pie-interactive';
  const [activeMonth, setActiveMonth] = useState(null); // 1. Initialize with null

  // 2. Use an effect to set the active month once the data is available
  React.useEffect(() => {
    // Check if we have data and if activeMonth hasn't been set yet
    if (countData && countData.length > 0) {
      setActiveMonth(countData[0]?.month);
    }
  }, [countData]); // 3. This effect runs whenever `countData` changes

  const activeIndex = useMemo(
    () => countData?.findIndex((item) => item.month === activeMonth),
    [activeMonth, countData] // Added countData
  );
  const months = useMemo(
    () => countData?.map((item) => item.month),
    [countData] // Changed from []
  );
  return (
    <Card data-chart={id} className="flex flex-col h-full shadow-none">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Feedbacks</CardTitle>
          <CardDescription>Showing total count of feedbacks.</CardDescription>
        </div>
        <Select value={activeMonth} onValueChange={setActiveMonth}>
          <SelectTrigger className="ml-auto h-7 w-[130px] rounded-lg pl-2.5" aria-label="Select a value">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {months?.map((key) => {
              // Removed type assertion `as keyof typeof chartConfig`
              const config = chartConfig[key];

              if (!config) {
                return null;
              }

              return (
                <SelectItem key={key} value={key} className="rounded-lg [&_span]:flex">
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-xs"
                      style={{
                        backgroundColor: `var(--color-${key})`,
                      }}
                    />
                    {config?.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer id={id} config={chartConfig} className="mx-auto aspect-square w-full max-w-[300px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={countData}
              dataKey="count"
              nameKey="month"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              // Removed the `: PieSectorDataItem` type annotation
              activeShape={({ outerRadius = 0, ...props }) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector {...props} outerRadius={outerRadius + 25} innerRadius={outerRadius + 12} />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                          {countData[activeIndex]?.count?.toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                          Feedbacks
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
