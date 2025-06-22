import authenticatedApi from '@/api/axiosInstance';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useAppointments = (filter = null) => {
  const queryClient = useQueryClient();
  const fetch = async (filter) => {
    const response = await authenticatedApi.get(`/appointments?filter=${filter || ''}`);
    if (response.status !== 200) {
      throw new Error('Failed to fetch services');
    }
    return response.data || [];
  };

  return useQuery({
    queryKey: ['appointments', filter],
    queryFn: ({ queryKey: [_key, filterValue] }) => fetch(filterValue),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
    onError: (error) => {
      console.error('Error fetching services:', error);
    },
  });
};

export const useGetAppointmentSummary = () => {
  const queryClient = useQueryClient();
  const queryFn = async () => {
    const response = await authenticatedApi.get(`/appointments/summary`);
    if (response.status !== 200) {
      throw new Error('Failed to fetch services');
    }
    return response.data || [];
  };

  return useQuery({
    queryKey: ['appointments', 'summary'],
    queryFn,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
    onError: (error) => {
      console.error('Error fetching services:', error);
    },
  });
};
