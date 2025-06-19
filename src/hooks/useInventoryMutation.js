import authenticatedApi, { getAxiosErrorMessage } from '@/api/axiosInstance';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useAddItem = () => {
  const queryClient = useQueryClient();

  const addItem = async (data) => {
    const response = await authenticatedApi.post('/inventory', data);
    if (response.status !== 201) {
      throw new Error('Failed to add item');
    }
    return response.data;
  };

  return useMutation({
    mutationFn: (data) => addItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries('inventory');
      alert('Item added successfully');
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error) || 'Failed to add item';
      console.error('Error adding item:', message);
      alert(message);
    },
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();

  const updateItem = async (data) => {
    console.log(data);
    const response = await authenticatedApi.patch(
      `/inventory/${data._id}`,
      data
    );
    if (response.status !== 201) {
      throw new Error('Failed to update item');
    }
    return response.data;
  };

  return useMutation({
    mutationFn: (data) => updateItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries('inventory');
      alert('Item updated successfully');
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error) || 'Failed to update item';
      console.error('Error updating item:', message);
      alert(message);
    },
  });
};

export const useAddStock = () => {
  const queryClient = useQueryClient();

  const addStock = async (data) => {
    const response = await authenticatedApi.patch(
      `/inventory/${data.id}/add-stock`,
      data
    );
    if (response.status !== 201) {
      throw new Error('Failed to add stock');
    }
    return response.data;
  };

  return useMutation({
    mutationFn: (data) => addStock(data),
    onSuccess: () => {
      queryClient.invalidateQueries('inventory');
      alert('Item stock added successfully');
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error) || 'Failed to add stock';
      console.error('Error adding stock:', message);
      alert(message);
    },
  });
};

export const useDeductStock = () => {
  const queryClient = useQueryClient();

  const deductStock = async (data) => {
    const response = await authenticatedApi.patch(
      `/inventory/${data.id}/deduct-stock`,
      data
    );
    if (response.status !== 201) {
      throw new Error('Failed to deduct stock');
    }
    return response.data;
  };

  return useMutation({
    mutationFn: (data) => deductStock(data),
    onSuccess: () => {
      queryClient.invalidateQueries('inventory');
      alert('Item stock deducted successfully');
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error) || 'Failed to deduct stock';
      console.error('Error deducting stock:', message);
      alert(message);
    },
  });
};
export const useDeleteItem = () => {
  const queryClient = useQueryClient();

  const deleteItem = async (data) => {
    const response = await authenticatedApi.delete(`/inventory/${data.id}`);
    if (response.status !== 204) {
      throw new Error('Failed to delete stock');
    }
    // return response.data;
  };

  return useMutation({
    mutationFn: (data) => deleteItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries('inventory');
      alert('Item deleted successfully');
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error) || 'Failed to delete stock';
      console.error('Error deleting stock:', message);
      alert(message);
    },
  });
};

export const useAddCategory = () => {
  const queryClient = useQueryClient();

  const addCategory = async (data) => {
    const response = await authenticatedApi.post(
      '/inventory/add-category',
      data
    );
    if (response.status !== 201) {
      throw new Error('Failed to add category');
    }
    return response.data;
  };

  return useMutation({
    mutationFn: (data) => addCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries('item-categories');
      alert('Category added successfully');
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error) || 'Failed to add category';
      console.error('Error adding category:', message);
      alert(message);
    },
  });
};
