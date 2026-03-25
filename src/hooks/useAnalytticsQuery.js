import authenticatedApi from '@/api/axiosInstance';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useFetchFeedbackAnalytics = () => {
  const queryClient = useQueryClient();
  const fetchFeedbackAnalytics = async () => {
    const response = await authenticatedApi.get('/analytics/feedback');
    if (response.status !== 200) {
      throw new Error('Failed to fetch feedback analytics');
    }
    return response.data || [];
  };

  return useQuery({
    queryKey: ['feedback-analyics'],
    queryFn: () => fetchFeedbackAnalytics(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
    onError: (error) => {
      console.error('Error fetching feedback analytics:', error);
    },
  });
};

export const useFetchServicesAnalytics = () => {
  const queryClient = useQueryClient();
  const fetchServicesAnalytics = async () => {
    const response = await authenticatedApi.get('/analytics/services');
    if (response.status !== 200) {
      throw new Error('Failed to fetch services analytics');
    }
    return response.data || [];
  };

  return useQuery({
    queryKey: ['services-analyics'],
    queryFn: () => fetchServicesAnalytics(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
    onError: (error) => {
      console.error('Error fetching services analytics:', error);
    },
  });
};

export const useFetchAppointmentsEvent = () => {
  const queryClient = useQueryClient();
  const fetchAppointmentsEvent = async () => {
    const response = await authenticatedApi.get('/analytics/appointments');
    if (response.status !== 200) {
      throw new Error('Failed to fetch apppointments events');
    }
    return response.data || [];
  };

  return useQuery({
    queryKey: ['apppointments-analyics'],
    queryFn: () => fetchAppointmentsEvent(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
    onError: (error) => {
      console.error('Error fetching apppointments events:', error);
    },
  });
};

export const useFetchAnalyticsInsights = () => {
  return useQuery({
    queryKey: ['analytics-insights'],
    queryFn: async () => {
      const response = await authenticatedApi.get('/analytics/insights');
      if (response.status !== 200) {
        throw new Error('Failed to fetch analytics insights');
      }
      return response.data;
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 30, // 30 minutes - insights are more expensive to generate
    cacheTime: 1000 * 60 * 60, // 60 minutes
    onError: (error) => {
      console.error('Error fetching analytics insights:', error);
    },
  });
};
