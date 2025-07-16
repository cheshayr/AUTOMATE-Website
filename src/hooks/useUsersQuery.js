import authenticatedApi from '@/api/axiosInstance';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useFetchUsers = (searchQuery = '', role = '', page = 1, limit = 10) => {
  // Add page and limit with defaults
  const queryClient = useQueryClient();

  const fetchUsers = async ({ queryKey }) => {
    // Extract parameters directly from queryKey for a cleaner approach
    const [_key, currentSearchQuery, currentRole, currentPage, currentLimit] = queryKey;

    // Construct query parameters
    const params = new URLSearchParams();
    if (currentSearchQuery) {
      params.append('searchQuery', currentSearchQuery);
    }
    if (currentRole && currentRole !== 'all') {
      params.append('role', currentRole);
    }
    params.append('page', currentPage);
    params.append('limit', currentLimit);

    // Make the API call with parameters
    const response = await authenticatedApi.get(`/users?${params.toString()}`);

    if (response.status !== 200) {
      throw new Error('Failed to fetch users');
    }
    return response.data; // Ensure your backend sends the full object with data, totalPages, etc.
  };

  return useQuery({
    // Include page and limit in the queryKey for react-query to re-fetch when they change
    queryKey: ['users', searchQuery, role, page, limit],
    queryFn: fetchUsers, // Pass the function directly
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
    onError: (error) => {
      console.error('Error fetching users:', error);
    },
    keepPreviousData: true, // Recommended for pagination for smoother UX
  });
};
