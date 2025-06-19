import authenticatedApi from '@/api/axiosInstance';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useFetchInventory = () => {
  const queryClient = useQueryClient();
  const fetchInventory = async () => {
    const response = await authenticatedApi.get('/inventory');
    if (response.status !== 200) {
      throw new Error('Failed to fetch inventory');
    }
    return response.data || [];
  };

  return useQuery({
    queryKey: ['inventory'],
    queryFn: () => fetchInventory(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
    onError: (error) => {
      console.error('Error fetching inventory:', error);
    },
  });
};

export const useFetchItemCategories = () => {
  const queryClient = useQueryClient();
  const fetchItemCategories = async () => {
    const response = await authenticatedApi.get('/inventory/item-categories');
    if (response.status !== 200) {
      throw new Error('Failed to fetch item categories');
    }
    return response.data || [];
  };

  return useQuery({
    queryKey: ['item-categories'],
    queryFn: () => fetchItemCategories(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
    onError: (error) => {
      console.error('Error fetching item categories:', error);
    },
  });
};
