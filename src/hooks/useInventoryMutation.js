import authenticatedApi, { getAxiosErrorMessage } from '@/api/axiosInstance';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// --- ADD ITEM ---
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
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Item added successfully');
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error) || 'Failed to add item';
      toast.error(message);
    },
  });
};

// --- UPDATE ITEM (Handles Stock In/Out & Supplier Updates) ---
export const useUpdateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const itemId = data.id || data._id;
      if (!itemId) throw new Error('Item ID is missing');

      // Tinatanggal ang ID sa payload para hindi mag-error ang MongoDB
      const { id, _id, ...payload } = data;

      const response = await authenticatedApi.patch(`/inventory/${itemId}`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Inventory updated successfully');
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error) || 'Failed to update item';
      toast.error(message);
    },
  });
};

// --- DELETE ITEM ---
export const useDeleteItem = () => {
  const queryClient = useQueryClient();

  const deleteItem = async (data) => {
    const response = await authenticatedApi.delete(`/inventory/${data.id}`);
    if (response.status !== 204 && response.status !== 200) {
      throw new Error('Failed to delete item');
    }
  };

  return useMutation({
    mutationFn: (data) => deleteItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Item deleted successfully');
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error) || 'Failed to delete item';
      toast.error(message);
    },
  });
};

// --- ADD CATEGORY ---
export const useAddCategory = () => {
  const queryClient = useQueryClient();

  const addCategory = async (data) => {
    // FIX: Changed from '/inventory/add-category' 
    // to '/inventory/item-categories' to match your backend routes
    const response = await authenticatedApi.post('/inventory/item-categories', data);
    
    if (response.status !== 201 && response.status !== 200) {
      throw new Error('Failed to add category');
    }
    return response.data;
  };

  return useMutation({
    mutationFn: (data) => addCategory(data),
    onSuccess: () => {
      // Refresh the list after adding
      queryClient.invalidateQueries({ queryKey: ['item-categories'] });
      toast.success('Category added successfully');
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error) || 'Failed to add category';
      toast.error(message);
    },
  });
};

// --- DELETE CATEGORY ---
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  const deleteCategory = async (data) => {
    // Siguraduhing data.id ang pinapasa
    const response = await authenticatedApi.delete(`/inventory/item-categories/${data.id}`);
    if (response.status !== 204 && response.status !== 200) {
      throw new Error('Failed to delete category');
    }
  };

  return useMutation({
    mutationFn: (data) => deleteCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item-categories'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Category deleted successfully');
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error) || 'Failed to delete category';
      toast.error(message);
    },
  });
};

// --- STOCK HANDLERS ---
export const useAddStock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await authenticatedApi.patch(`/inventory/${data.id}/add-stock`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Stock added');
    },
  });
};

export const useDeductStock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await authenticatedApi.patch(`/inventory/${data.id}/deduct-stock`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Stock deducted');
    },
  });
};