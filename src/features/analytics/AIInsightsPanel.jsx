'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useFetchAnalyticsInsights } from '@/hooks/useAnalytticsQuery';
import { Zap, RotateCw } from 'lucide-react';

export function AIInsightsPanel() {
  const { data, isPending, isError, refetch } = useFetchAnalyticsInsights();

  const insights = data?.data?.insights;
  const summary = data?.data?.summary;

  return (
    <Card className="shadow-none border h-full">
      <CardHeader className="pb-3 space-y-0">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-base">
              AI Insights
            </CardTitle>
           
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            disabled={isPending}
            className="h-8 w-8 p-0"
          >
            <RotateCw className={`h-3.5 w-3.5 ${isPending ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {isPending ? (
          <div className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-3 w-4/5" />
          </div>
        ) : isError ? (
          <div className="text-xs text-red-500">Failed to load insights.</div>
        ) : insights ? (
          <div className="space-y-2">
            <div className="text-xs leading-tight text-muted-foreground space-y-1.5">
              {insights.split('\n').map((line, i) => (
                line.trim() && (
                  <p key={i} className="text-xs">
                    {line.trim().replace(/^\* /, '• ')}
                  </p>
                )
              ))}
            </div>

            {summary && (
              <div className="mt-2 pt-2 border-t space-y-1 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Completed:</span>
                  <span className="font-semibold text-foreground">{summary.totalCompleted}</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Rating:</span>
                  <span className="font-semibold text-foreground">{summary.averageRating} ⭐</span>
                </div>
                {summary.topService && (
                  <div className="flex justify-between">
                    <span>Top Service:</span>
                    <span className="font-semibold text-foreground text-right truncate ml-2">{summary.topService._id}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No insights available</p>
        )}
      </CardContent>
    </Card>
  );
}
