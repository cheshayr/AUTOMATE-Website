import authenticatedApi from '@/api/axiosInstance';
import { useQuery } from '@tanstack/react-query';

export const useFetchTransactions = (itemName) => {
  return useQuery({
    queryKey: ['transactions', itemName],
    queryFn: async () => {
      if (!itemName) return [];
    
      const response = await authenticatedApi.get(`/transactions?itemName=${itemName}`);
      return response.data || [];
    },
    enabled: !!itemName,
    refetchOnWindowFocus: false,
  });
};