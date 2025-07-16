import authenticatedApi from '@/api/axiosInstance';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetDashboardSummary = () => {
  const queryClient = useQueryClient();
  const queryFn = async () => {
    const response = await authenticatedApi.get(`/dashboard/summary`);
    if (response.status !== 200) {
      throw new Error('Failed to fetch services');
    }
    return response.data || [];
  };

  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
    onError: (error) => {
      console.error('Error fetching services:', error);
    },
  });
};

export const useGetServices = () => {
  const queryClient = useQueryClient();
  const queryFn = async () => {
    const response = await authenticatedApi.get(`/dashboard/monthly-services`);
    if (response.status !== 200) {
      throw new Error('Failed to fetch services');
    }
    return response.data || [];
  };

  return useQuery({
    queryKey: ['monthly-services'],
    queryFn,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
    onError: (error) => {
      console.error('Error fetching services:', error);
    },
  });
};

export const useGetSales = () => {
  const queryClient = useQueryClient();
  const queryFn = async () => {
    const response = await authenticatedApi.get(`/dashboard/monthly-sales`);
    if (response.status !== 200) {
      throw new Error('Failed to fetch sales');
    }
    return response.data || [];
  };

  return useQuery({
    queryKey: ['monthly-sales'],
    queryFn,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
    onError: (error) => {
      console.error('Error fetching sales:', error);
    },
  });
};
