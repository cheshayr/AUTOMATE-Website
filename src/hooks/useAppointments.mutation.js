import authenticatedApi, { getAxiosErrorMessage } from '@/api/axiosInstance';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useAdminUpdateAppointment = () => {
  const queryClient = useQueryClient();

  const mutationFn = async (payload) => {
    console.log({ payload });
    const response = await authenticatedApi.patch(`/appointments/${payload.id}`, payload.updatedData);
    if (response.status !== 200) {
      throw new Error('Failed to update appointment');
    }
    return response.data;
  };

  return useMutation({
    mutationFn: (payload) => mutationFn(payload),
    onSuccess: () => {
      queryClient.invalidateQueries('appointments');
      alert('Appointment updated successfully');
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error) || 'Failed to update appointment';
      console.error('Error updating appointment:', message);
      alert(message);
    },
  });
};

export const useAdminDeleteAppointment = () => {
  const queryClient = useQueryClient();

  const mutationFn = async (payload) => {
    console.log({ payload });
    const response = await authenticatedApi.delete(`/appointments/${payload.id}`, payload.updatedData);
    if (response.status !== 204) {
      throw new Error('Failed to delete appointment');
    }
    return response.data;
  };

  return useMutation({
    mutationFn: (payload) => mutationFn(payload),
    onSuccess: () => {
      queryClient.invalidateQueries('appointments');
      alert('Appointment deleted successfully');
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error) || 'Failed to delete appointment';
      console.error('Error deleteing appointment:', message);
      alert(message);
    },
  });
};
