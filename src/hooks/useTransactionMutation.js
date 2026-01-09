import authenticatedApi, { getAxiosErrorMessage } from '@/api/axiosInstance';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
     
      const response = await authenticatedApi.post('/transactions', data);
      return response.data;
    },
    onSuccess: () => {
    
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error) || 'Failed to record transaction';
      toast.error(message);
    },
  });
};