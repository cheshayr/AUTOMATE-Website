'use client';

import React, { useMemo } from 'react';
import { Star } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFetchFeedbackAnalytics } from '@/hooks/useAnalytticsQuery';

export const description = 'A horizontal bar chart showing rating distribution';

// Removed the `satisfies ChartConfig` operator
const chartConfig = {
  star1: {
    label: '1 Star',
    color: '#ef4444',
  },
  star2: {
    label: '2 Star',
    color: '#f97316',
  },
  star3: {
    label: '3 Star',
    color: '#eab308',
  },
  star4: {
    label: '4 Star',
    color: '#84cc16',
  },
  star5: {
    label: '5 Star',
    color: '#22c55e',
  },
};

export function FeedbacksAnalytics() {
  const { data, isPending, isSuccess } = useFetchFeedbackAnalytics();

  const countData = data?.data;

  // Calculate overall rating and total count
  const stats = useMemo(() => {
    if (!countData || countData.length === 0) return { avgRating: 0, totalReviews: 0, maxCount: 0 };

    let totalReviews = 0;
    let totalRating = 0;
    let maxCount = 0;

    countData.forEach((item) => {
      const starValue = parseInt(item.month.replace('star', ''));
      totalReviews += item.count;
      totalRating += starValue * item.count;
      maxCount = Math.max(maxCount, item.count);
    });

    const avgRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0;
    return { avgRating, totalReviews, maxCount };
  }, [countData]);

  // Render star rating stars
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star
            key={i}
            size={16}
            className="fill-yellow-400 text-yellow-400"
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <Star size={16} className="text-gray-300" />
            <div className="absolute top-0 left-0 overflow-hidden w-2">
              <Star size={16} className="fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        );
      } else {
        stars.push(
          <Star
            key={i}
            size={16}
            className="text-gray-300"
          />
        );
      }
    }
    return stars;
  };

  return (
    <Card className="flex flex-col h-full shadow-none">
      <CardHeader className="pb-4">
        <div className="grid gap-1">
          <CardTitle>Feedbacks</CardTitle>
          <CardDescription>Showing total count of feedbacks.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        {isSuccess && countData?.filter((el) => el.count > 0).length > 0 ? (
          <div className="space-y-6">
            {/* Overall Rating Section */}
            <div className="text-center space-y-2">
              <div className="text-5xl font-bold text-gray-900 dark:text-gray-100">
                {stats.avgRating}
              </div>
              <div className="flex justify-center gap-1">
                {renderStars(parseFloat(stats.avgRating))}
              </div>
              <div className="text-sm text-gray-500">
                {stats.totalReviews.toLocaleString()} {stats.totalReviews === 1 ? 'review' : 'reviews'}
              </div>
            </div>

            {/* Horizontal Bars Section */}
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((starLevel) => {
                const starData = countData?.find((item) => item.month === `star${starLevel}`);
                const count = starData?.count || 0;
                const percentage = stats.maxCount > 0 ? (count / stats.maxCount) * 100 : 0;

                return (
                  <div key={starLevel} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium w-8">{starLevel}</span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: starLevel }).map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className="fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: chartConfig[`star${starLevel}`]?.color,
                          }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                        {count.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="min-h-64 flex items-center justify-center">
            <p className="text-gray-500">No ratings to show yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
