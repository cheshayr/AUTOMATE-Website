import authenticatedApi from '@/api/axiosInstance';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useFetchUsers = (searchQuery) => {
  const queryClient = useQueryClient();

  const fetchUsers = async (searchQuery) => {
    const response = await authenticatedApi.get(`/users?searchQuery=${searchQuery}`);
    if (response.status !== 200) {
      throw new Error('Failed to fetch users');
    }
    return response.data || [];
  };

  return useQuery({
    queryKey: ['users', searchQuery],
    queryFn: ({ queryKey: [_key, searchQuery] }) => fetchUsers(searchQuery),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
    onError: (error) => {
      console.error('Error fetching users:', error);
    },
  });
};
