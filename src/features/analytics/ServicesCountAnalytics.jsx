'use client';

import * as React from 'react';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

export const description = 'An interactive line chart';

const chartData = [
  {
    date: '2024-04-01',
    desktop: 222,
    mobile: 150,
    tablet: 80,
    visits: 452,
    newUsers: 310,
    bounces: 90,
    avgDuration: 180,
    conversions: 22,
  },
  {
    date: '2024-04-02',
    desktop: 97,
    mobile: 180,
    tablet: 65,
    visits: 342,
    newUsers: 250,
    bounces: 75,
    avgDuration: 120,
    conversions: 15,
  },
  {
    date: '2024-04-03',
    desktop: 167,
    mobile: 120,
    tablet: 70,
    visits: 357,
    newUsers: 280,
    bounces: 80,
    avgDuration: 150,
    conversions: 18,
  },
  {
    date: '2024-04-04',
    desktop: 242,
    mobile: 260,
    tablet: 120,
    visits: 622,
    newUsers: 450,
    bounces: 120,
    avgDuration: 240,
    conversions: 45,
  },
  {
    date: '2024-04-05',
    desktop: 373,
    mobile: 290,
    tablet: 150,
    visits: 813,
    newUsers: 600,
    bounces: 150,
    avgDuration: 280,
    conversions: 60,
  },
  {
    date: '2024-04-06',
    desktop: 301,
    mobile: 340,
    tablet: 180,
    visits: 821,
    newUsers: 650,
    bounces: 160,
    avgDuration: 300,
    conversions: 70,
  },
  {
    date: '2024-04-07',
    desktop: 245,
    mobile: 180,
    tablet: 90,
    visits: 515,
    newUsers: 400,
    bounces: 100,
    avgDuration: 200,
    conversions: 35,
  },
  {
    date: '2024-04-08',
    desktop: 409,
    mobile: 320,
    tablet: 160,
    visits: 889,
    newUsers: 700,
    bounces: 180,
    avgDuration: 320,
    conversions: 80,
  },
];

const chartConfig = {
  views: {
    label: 'Page Views',
  },
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)',
  },
  mobile: {
    label: 'Mobile',
    color: 'var(--chart-2)',
  },
};

export function ServicesCountAnalytics() {
  // Removed the TypeScript generic type from useState
  const [activeChart, setActiveChart] = React.useState('desktop');

  const total = React.useMemo(
    () => ({
      desktop: chartData.reduce((acc, curr) => acc + curr.desktop, 0),
      mobile: chartData.reduce((acc, curr) => acc + curr.mobile, 0),
    }),
    []
  );

  return (
    <Card className="py-4 sm:py-0 shadow-none h-full">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0 w-3/12">
          <CardTitle>Services Insights</CardTitle>
          <CardDescription> Showing total availed services for the last 3 months </CardDescription>
        </div>
        <div className="flex overflow-auto w-9/12">
          {[
            'desktop',
            'mobile',
            'desktop',
            'mobile',
            'desktop',
            'mobile',
            'desktop',
            'mobile',
            'desktop',
            'mobile',
            'desktop',
            'mobile',
            'desktop',
            'mobile',
          ].map((key) => {
            const chart = key;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-xs"> {chartConfig[chart].label}</span>
                <span className="text-lg leading-none font-bold sm:text-3xl">
                  {/* Removed the type assertion for `key` */} {total[key].toLocaleString()}
                </span>
                 
              </button>
            );
          })}
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
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });
                    __;
                  }}
                />
              }
            />
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={`var(--color-${activeChart})`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
