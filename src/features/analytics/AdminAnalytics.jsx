import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ServicesCountAnalytics } from './ServicesCountAnalytics';
import { FeedbacksAnalytics } from './FeedbacksAnalytics';
import { AIInsightsPanel } from './AIInsightsPanel';
import { Appointments } from './Appointments';

const AdminAnalytics = () => {
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
            <ServicesCountAnalytics />
          </div>
          <div className="space-y-4 flex flex-col">
            <div className="flex-1">
              <FeedbacksAnalytics />
            </div>
            <div className="flex-shrink-0">
              <AIInsightsPanel />
            </div>
          </div>
        </div>
        {/* <Appointments />  */}
      </CardContent>
    </Card>
  );
};

export default AdminAnalytics;
