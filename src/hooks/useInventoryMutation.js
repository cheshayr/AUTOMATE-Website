import authenticatedApi, { getAxiosErrorMessage } from '@/api/axiosInstance';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

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
      toast.success('Item added successfully');
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error) || 'Failed to add item';
      console.error('Error adding item:', message);
      toast.error(message);
    },
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();

  const updateItem = async (data) => {
    console.log(data);
    const response = await authenticatedApi.patch(`/inventory/${data._id}`, data);
if (response.status !== 200 && response.status !== 201) {
  throw new Error('Failed to update item');
}
    return response.data;
  };

  return useMutation({
    mutationFn: (data) => updateItem(data),
    onSuccess: () => {
      // Invalidate both inventory and specific item queries if necessary
      queryClient.invalidateQueries('inventory'); 
      toast.success('Item updated successfully');
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error) || 'Failed to update item';
      console.error('Error updating item:', message);
      toast.error(message);
    },
  });
};

// NOTE: useAddStock is kept, but no longer used by the StockManagement UI
export const useAddStock = () => {
  const queryClient = useQueryClient();

  const addStock = async (data) => {
    const response = await authenticatedApi.patch(`/inventory/${data.id}/add-stock`, data);
    if (response.status !== 201) {
      throw new Error('Failed to add stock');
    }
    return response.data;
  };

  return useMutation({
    mutationFn: (data) => addStock(data),
    onSuccess: () => {
      queryClient.invalidateQueries('inventory');
      toast.success('Item stock added successfully');
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error) || 'Failed to add stock';
      console.error('Error adding stock:', message);
      toast.error(message);
    },
  });
};

// NOTE: useDeductStock is kept, but no longer used by the StockManagement UI
export const useDeductStock = () => {
  const queryClient = useQueryClient();

  const deductStock = async (data) => {
    const response = await authenticatedApi.patch(`/inventory/${data.id}/deduct-stock`, data);
    if (response.status !== 201) {
      throw new Error('Failed to deduct stock');
    }
    return response.data;
  };

  return useMutation({
    mutationFn: (data) => deductStock(data),
    onSuccess: () => {
      queryClient.invalidateQueries('inventory');
      toast.success('Item stock deducted successfully');
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error) || 'Failed to deduct stock';
      console.error('Error deducting stock:', message);
      toast.error(message);
    },
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();

  const deleteItem = async (data) => {
    // Assuming API returns 204 No Content for successful deletion
    const response = await authenticatedApi.delete(`/inventory/${data.id}`);
    if (response.status !== 204 && response.status !== 200) {
      throw new Error('Failed to delete item');
    }
    // No response.data expected for 204
  };

  return useMutation({
    mutationFn: (data) => deleteItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries('inventory');
      toast.success('Item deleted successfully');
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error) || 'Failed to delete item';
      console.error('Error deleting item:', message);
      toast.error(message);
    },
  });
};

export const useAddCategory = () => {
  const queryClient = useQueryClient();

  const addCategory = async (data) => {
    const response = await authenticatedApi.post('/inventory/add-category', data);
    if (response.status !== 201) {
      throw new Error('Failed to add category');
    }
    return response.data;
  };

  return useMutation({
    mutationFn: (data) => addCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries('item-categories');
      toast.success('Category added successfully');
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error) || 'Failed to add category';
      console.error('Error adding category:', message);
      toast.error(message);
    },
  });
};

/**
 * Hook for deleting an item category.
 * This was added to support the Delete Category feature requested.
 */
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  const deleteCategory = async (data) => {
  const response = await authenticatedApi.delete(`/inventory/item-categories/${data.id}`);
  if (response.status !== 204 && response.status !== 200) {
    throw new Error('Failed to delete category');
  }
};

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries('item-categories');
      queryClient.invalidateQueries('inventory');
      toast.success('Category deleted successfully');
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error) || 'Failed to delete category';
      console.error('Error deleting category:', message);
      toast.error(message);
    },
  });
};