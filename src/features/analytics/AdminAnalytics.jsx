import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ServicesCountAnalytics } from './ServicesCountAnalytics';
import { FeedbacksAnalytics } from './FeedbacksAnalytics';
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
        <div className="flex gap-6">
          <div className="w-[70%]">
            <ServicesCountAnalytics />
          </div>
          <div className="w-[30%]">
            <FeedbacksAnalytics />
          </div>
        </div>
        {/* <Appointments />  */}
      </CardContent>
    </Card>
  );
};

export default AdminAnalytics;
