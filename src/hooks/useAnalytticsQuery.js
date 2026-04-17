import authenticatedApi from '@/api/axiosInstance';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useFetchFeedbackAnalytics = (dateRange = {}) => {
  const queryClient = useQueryClient();
  const fetchFeedbackAnalytics = async () => {
    const params = new URLSearchParams();
    if (dateRange.from) {
      params.append('startDate', dateRange.from.toISOString().split('T')[0]);
    }
    if (dateRange.to) {
      params.append('endDate', dateRange.to.toISOString().split('T')[0]);
    }
    
    const response = await authenticatedApi.get(`/analytics/feedback?${params.toString()}`);
    if (response.status !== 200) {
      throw new Error('Failed to fetch feedback analytics');
    }
    return response.data || [];
  };

  return useQuery({
    queryKey: ['feedback-analyics', dateRange.from, dateRange.to],
    queryFn: () => fetchFeedbackAnalytics(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
    onError: (error) => {
      console.error('Error fetching feedback analytics:', error);
    },
  });
};

export const useFetchServicesAnalytics = (dateRange = {}) => {
  const queryClient = useQueryClient();
  const fetchServicesAnalytics = async () => {
    const params = new URLSearchParams();
    if (dateRange.from) {
      params.append('startDate', dateRange.from.toISOString().split('T')[0]);
    }
    if (dateRange.to) {
      params.append('endDate', dateRange.to.toISOString().split('T')[0]);
    }
    
    const response = await authenticatedApi.get(`/analytics/services?${params.toString()}`);
    if (response.status !== 200) {
      throw new Error('Failed to fetch services analytics');
    }
    return response.data || [];
  };

  return useQuery({
    queryKey: ['services-analyics', dateRange.from, dateRange.to],
    queryFn: () => fetchServicesAnalytics(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
    onError: (error) => {
      console.error('Error fetching services analytics:', error);
    },
  });
};

export const useFetchAppointmentsEvent = (dateRange = {}) => {
  const queryClient = useQueryClient();
  const fetchAppointmentsEvent = async () => {
    const params = new URLSearchParams();
    if (dateRange.from) {
      params.append('startDate', dateRange.from.toISOString().split('T')[0]);
    }
    if (dateRange.to) {
      params.append('endDate', dateRange.to.toISOString().split('T')[0]);
    }
    
    const response = await authenticatedApi.get(`/analytics/appointments?${params.toString()}`);
    if (response.status !== 200) {
      throw new Error('Failed to fetch apppointments events');
    }
    return response.data || [];
  };

  return useQuery({
    queryKey: ['apppointments-analyics', dateRange.from, dateRange.to],
    queryFn: () => fetchAppointmentsEvent(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
    onError: (error) => {
      console.error('Error fetching apppointments events:', error);
    },
  });
};

export const useFetchAnalyticsInsights = (dateRange = {}) => {
  return useQuery({
    queryKey: ['analytics-insights', dateRange.from, dateRange.to],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (dateRange.from) {
        params.append('startDate', dateRange.from.toISOString().split('T')[0]);
      }
      if (dateRange.to) {
        params.append('endDate', dateRange.to.toISOString().split('T')[0]);
      }
      
      const response = await authenticatedApi.get(`/analytics/insights?${params.toString()}`);
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
