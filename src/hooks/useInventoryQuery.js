import authenticatedApi from '@/api/axiosInstance';
import { useQuery, useQueryClient } from '@tanstack/react-query';

/* ================= INVENTORY FETCH ================= */
export const useFetchInventory = ({ filter, searchQuery }) => {
  const queryClient = useQueryClient();
  const fetchInventory = async (filter, searchQuery) => {
    const response = await authenticatedApi.get(`/inventory`, {
      params: { filter, searchQuery }
    });
    if (response.status !== 200) {
      throw new Error('Failed to fetch inventory');
    }
    return response.data || [];
  };

  return useQuery({
    queryKey: ['inventory', filter, searchQuery],
    queryFn: ({ queryKey: [_key, filterValue, searchQueryValue] }) =>
      fetchInventory(filterValue, searchQueryValue),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
    onError: (error) => console.error('Error fetching inventory:', error),
  });
};

/* ================= ITEM CATEGORIES FETCH ================= */
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
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    onError: (error) => console.error('Error fetching item categories:', error),
  });
};
