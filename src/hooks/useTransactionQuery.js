import authenticatedApi from '@/api/axiosInstance';
import { useQuery } from '@tanstack/react-query';

/**
 * options:
 * - itemName?: string
 * - searchQuery?: string
 */
export const useFetchTransactions = (options = {}) => {
  const { itemName, searchQuery } = options;

  return useQuery({
    queryKey: ['transactions', itemName, searchQuery],
    queryFn: async () => {
      const params = {};

      if (itemName) params.itemName = itemName;
      if (searchQuery) params.search = searchQuery;

      const response = await authenticatedApi.get('/transactions', {
        params,
      });

      return response.data || { data: [] };
    },
  });
};
