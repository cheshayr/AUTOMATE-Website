import authenticatedApi, { getAxiosErrorMessage } from '@/api/axiosInstance';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useAddCategory = () => {
  const queryClient = useQueryClient();

  const addCategory = async (data) => {
    const response = await authenticatedApi.post('/inventory', data);
    if (response.status !== 201) {
      throw new Error('Failed to add category');
    }
    return response.data;
  };

  return useMutation({
    mutationFn: (data) => addCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries('inventory');
      alert('Category added successfully');
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error) || 'Failed to add category';
      console.error('Error adding category:', message);
      alert(message);
    },
  });
};
