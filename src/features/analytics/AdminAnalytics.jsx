import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ServicesCountAnalytics } from './ServicesCountAnalytics';
import { FeedbacksAnalytics } from './FeedbacksAnalytics';
import { AIInsightsPanel } from './AIInsightsPanel';
import { Appointments } from './Appointments';

const AdminAnalytics = () => {
  const [dateRange, setDateRange] = useState({
    from: null,
    to: null,
  });

  return (
    <Card className="w-full bg-transparent shadow-none border-0">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Data Analytics</CardTitle>
        <CardDescription className="line-clamp-3">
          Uncover trends, visualize insights, and make informed decisions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <ServicesCountAnalytics dateRange={dateRange} setDateRange={setDateRange} />
          </div>
          <div className="space-y-4 flex flex-col">
            <div className="flex-1">
              <FeedbacksAnalytics dateRange={dateRange} />
            </div>
            <div className="flex-shrink-0">
              <AIInsightsPanel dateRange={dateRange} />
            </div>
          </div>
        </div>
        {/* <Appointments />  */}
      </CardContent>
    </Card>
  );
};

export default AdminAnalytics;
