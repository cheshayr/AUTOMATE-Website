import authenticatedApi, { getAxiosErrorMessage } from '@/api/axiosInstance';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useAddUser = () => {
  const queryClient = useQueryClient();

  const addUser = async (data) => {
    console.log(data);
    const response = await authenticatedApi.post(`/users`, data);
    if (response.status !== 201) {
      throw new Error('Failed to add user');
    }
    return response.data;
  };

  return useMutation({
    mutationFn: (data) => addUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries('users');
      toast.success('User added successfully');
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error) || 'Failed to add user';
      console.error('Error adding a user:', message);
      toast.error(message);
    },
  });
};

export const useActivateUser = () => {
  const queryClient = useQueryClient();

  const activateUser = async (data) => {
    const response = await authenticatedApi.patch(`/users/${data.id}/reactivate-account`, data);
    if (response.status !== 201) {
      throw new Error('Failed to activate user');
    }
    return response.data;
  };

  return useMutation({
    mutationFn: (data) => activateUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries('users');
      toast.success('User activated successfully');
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error) || 'Failed to activate user';
      console.error('Error activating user:', message);
      toast.error(message);
    },
  });
};

export const useDeactivateUser = () => {
  const queryClient = useQueryClient();

  const deactivateUser = async (data) => {
    const response = await authenticatedApi.patch(`/users/${data.id}/deactivate-account`, data);
    if (response.status !== 201) {
      throw new Error('Failed to deactivate user');
    }
    return response.data;
  };

  return useMutation({
    mutationFn: (data) => deactivateUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries('users');
      toast.success('User deactivated successfully');
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error) || 'Failed to deactivate user';
      console.error('Error deactivating user:', message);
      toast.error(message);
    },
  });
};
