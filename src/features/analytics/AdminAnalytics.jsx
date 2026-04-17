import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ServicesCountAnalytics } from './ServicesCountAnalytics';
import { FeedbacksAnalytics } from './FeedbacksAnalytics';
import { AIInsightsPanel } from './AIInsightsPanel';
import { Appointments } from './Appointments';

const AdminAnalytics = () => {
  const [dateRange, setDateRange] = useState({
    from: null,
    to: null,
  });
  const [preparedBy, setPreparedBy] = useState('');
  const [isAutoFilled, setIsAutoFilled] = useState(true);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (loggedInUser && isAutoFilled) {
      if (loggedInUser.role === 'staff') {
        const fullName = loggedInUser.name || '';
        const role = loggedInUser.role || '';
        const position = loggedInUser.position || '';
        const formatted = `${fullName} ${position ? `- ${position}` : ''} (${role})`;
        setPreparedBy(formatted);
      }
    }
  }, [isAutoFilled]);

  return (
    <Card className="w-full bg-transparent shadow-none border-0">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Data Analytics</CardTitle>
        <CardDescription className="line-clamp-3">
          Uncover trends, visualize insights, and make informed decisions.
        </CardDescription>
        <div className="mt-4 flex items-end gap-4">
          <div className="flex-1 max-w-xs">
            <Label htmlFor="prepared-by" className="text-sm mb-2 block">Prepared By</Label>
            <Input
              id="prepared-by"
              placeholder="Enter your name"
              value={preparedBy}
              onChange={(e) => setPreparedBy(e.target.value)}
              disabled={preparedBy && JSON.parse(localStorage.getItem('user'))?.role === 'staff'}
              className="text-sm"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <ServicesCountAnalytics 
              dateRange={dateRange} 
              setDateRange={setDateRange}
              preparedBy={preparedBy}
              setPreparedBy={setPreparedBy}
            />
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
