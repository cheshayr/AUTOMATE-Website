import authenticatedApi, { authenticatedApiForm, getAxiosErrorMessage } from '@/api/axiosInstance';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

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
      toast.success('Appointment updated successfully');
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error) || 'Failed to update appointment';
      console.error('Error updating appointment:', message);
      toast.error(message);
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
      toast.success('Appointment deleted successfully');
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error) || 'Failed to delete appointment';
      console.error('Error deleteing appointment:', message);
      toast.error(message);
    },
  });
};

export const useUploadInvoice = () => {
  const queryClient = useQueryClient();

  const mutationFn = async (payload) => {
    const id = payload.id;
    const data = payload.updatedData;

    const response = await authenticatedApiForm.patch(`/appointments/${id}/upload-invoice`, data);
    if (response.status !== 200) {
      throw new Error('Failed to upload invoice');
    }
    return response.data;
  };

  return useMutation({
    mutationFn: (data) => mutationFn(data),
    onSuccess: (data, payload) => {
      queryClient.invalidateQueries(['appointment', payload.id]);
      toast.success('Invoice uploaded successfully');
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error) || 'Failed to upload invoice';
      console.error('Error on uploading invoice: ', message);
      toast.error(message);
    },
  });
};
