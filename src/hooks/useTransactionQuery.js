import authenticatedApi from '@/api/axiosInstance';
import { useQuery } from '@tanstack/react-query';

export const useFetchTransactions = (options = {}) => {
  const { itemName, searchQuery } = options;

  return useQuery({
    queryKey: ['transactions', itemName, searchQuery],
    queryFn: async () => {
      const params = {};
      if (itemName) params.itemName = itemName;
      if (searchQuery) params.search = searchQuery;

      const res = await authenticatedApi.get('/transactions', { params });
      return res.data || { data: [] };
    },
    refetchOnWindowFocus: false,
  });
};
