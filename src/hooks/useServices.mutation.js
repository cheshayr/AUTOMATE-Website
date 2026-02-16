import authenticatedApi, {
  authenticatedApiForm,
  getAxiosErrorMessage,
} from '@/api/axiosInstance';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

/* =========================
   ADD SERVICE
========================= */
export const useAddService = () => {
  const queryClient = useQueryClient();

  const addService = async (formData) => {
    const response = await authenticatedApiForm.post(
      '/services',
      formData
    );

    if (response.status !== 201) {
      throw new Error('Failed to add service');
    }

    return response.data;
  };

  return useMutation({
    mutationFn: addService,
    onSuccess: () => {
      queryClient.invalidateQueries(['services']);
      toast.success('Service added successfully');
    },
    onError: (error) => {
      const message =
        getAxiosErrorMessage(error) || 'Failed to add service';
      console.error('Error adding service:', message);
      toast.error(message);
    },
  });
};

/* =========================
   EDIT SERVICE
========================= */
export const useEditService = () => {
  const queryClient = useQueryClient();

  /**
   * payload = {
   *   id: string,
   *   data: FormData
   * }
   */
  const editService = async ({ id, data }) => {
    const response = await authenticatedApiForm.patch(
      `/services/${id}`,
      data
    );


    if (response.status !== 200) {
      throw new Error('Failed to edit service');
    }

    return response.data;
  };

  return useMutation({
    mutationFn: editService,
    onSuccess: () => {
      queryClient.invalidateQueries(['services']);
      toast.success('Service edited successfully');
    },
    onError: (error) => {
      const message =
        getAxiosErrorMessage(error) || 'Failed to edit service';
      console.error('Error editing service:', message);
      toast.error(message);
    },
  });
};

/* =========================
   DELETE SERVICE
========================= */
export const useDeleteService = () => {
  const queryClient = useQueryClient();

  const deleteService = async (id) => {
    const response = await authenticatedApi.delete(
      `/services/${id}`
    );

    if (response.status !== 200) {
      throw new Error('Failed to delete service');
    }

    return response.data;
  };

  return useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries(['services']);
      toast.success('Service deleted successfully');
    },
    onError: (error) => {
      const message =
        getAxiosErrorMessage(error) || 'Failed to delete service';
      console.error('Error deleting service:', message);
      toast.error(message);
    },
  });
};


