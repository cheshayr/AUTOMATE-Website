import authenticatedApi from '@/api/axiosInstance'; // Make sure this path is correct
import { useQuery, useQueryClient } from '@tanstack/react-query';

// Add page and limit parameters with default values
export const useFetchUsers = (searchQuery = '', role = '', page = 1, limit = 10) => {
  const queryClient = useQueryClient();

  const fetchUsers = async ({ queryKey }) => {
    // Extract parameters directly from queryKey to ensure consistency
    const [_key, currentSearchQuery, currentRole, currentPage, currentLimit] = queryKey;

    const params = new URLSearchParams(); // Create URLSearchParams object

    if (currentSearchQuery) {
      params.append('searchQuery', currentSearchQuery);
    }
    // Only append role if it's provided and not 'all' (if 'all' is a special value you handle)
    if (currentRole && currentRole !== 'all') {
      params.append('role', currentRole);
    }
    params.append('page', currentPage); // Append pagination parameters
    params.append('limit', currentLimit);

    // Make the API call, converting params to a query string
    const response = await authenticatedApi.get(`/users?${params.toString()}`);

    if (response.status !== 200) {
      throw new Error('Failed to fetch users');
    }
    // Ensure you return the entire data object which contains pagination metadata
    return response.data;
  };

  return useQuery({
    // The queryKey must include all parameters that affect the data, including page and limit
    queryKey: ['users', searchQuery, role, page, limit],
    queryFn: fetchUsers,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
    onError: (error) => {
      console.error('Error fetching users:', error);
    },
    // Keep previous data visible while new data is fetching for a smoother UX
    keepPreviousData: true,
  });
};
