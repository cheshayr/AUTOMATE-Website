// hooks/useTransactionQuery.js
import authenticatedApi from '@/api/axiosInstance';
import { useQuery } from '@tanstack/react-query';

export const useFetchTransactions = (itemName) => {
  return useQuery({
    // The queryKey includes itemName so that Cache is separate for each product
    queryKey: ['transactions', itemName], 
    queryFn: async () => {
      if (!itemName) return [];
      // This sends /api/transactions?itemName=ProductA
      const response = await authenticatedApi.get(`/transactions?itemName=${encodeURIComponent(itemName)}`);
      return response.data || [];
    },
    enabled: !!itemName, 
  });
};