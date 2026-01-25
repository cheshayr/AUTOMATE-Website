import authenticatedApi, { getAxiosErrorMessage } from '@/api/axiosInstance';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useCreateTransaction } from './useTransactionMutation'; // Ensure this exists

/* ================= ADD ITEM ================= */
export const useAddItem = () => {
  const queryClient = useQueryClient();
  const createTransaction = useCreateTransaction();

  const addItem = async (data) => {
    const response = await authenticatedApi.post('/inventory', data);
    if (response.status !== 201) throw new Error('Failed to add item');
    return response.data;
  };

  return useMutation({
    mutationFn: addItem,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Item added successfully');

      createTransaction.mutate({
        type: 'SYSTEM',
        itemName: variables.itemName,
        quantity: variables.quantity || 0,
        reason: 'Item added',
        remarks: `Item ID: ${data._id}`,
        dateTime: new Date().toISOString(),
      });
    },
    onError: (error) => toast.error(getAxiosErrorMessage(error) || 'Failed to add item'),
  });
};

/* ================= UPDATE ITEM ================= */
export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  const createTransaction = useCreateTransaction();

  return useMutation({
    mutationFn: async (data) => {
      const itemId = data.id || data._id;
      if (!itemId) throw new Error('Item ID is missing');

      const { id, _id, ...payload } = data;
      const response = await authenticatedApi.patch(`/inventory/${itemId}`, payload);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Inventory updated successfully');

      createTransaction.mutate({
        type: 'SYSTEM',
        itemName: variables.itemName || 'Unknown',
        quantity: variables.quantity || 0,
        reason: 'Item updated',
        remarks: `Item ID: ${variables.id || variables._id}`,
        dateTime: new Date().toISOString(),
      });
    },
    onError: (error) => toast.error(getAxiosErrorMessage(error) || 'Failed to update item'),
  });
};

/* ================= DELETE ITEM ================= */
export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  const createTransaction = useCreateTransaction();

  const deleteItem = async (data) => {
    const response = await authenticatedApi.delete(`/inventory/${data.id}`);
    if (![200, 204].includes(response.status)) throw new Error('Failed to delete item');
    return data;
  };

  return useMutation({
    mutationFn: deleteItem,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Item deleted successfully');

      createTransaction.mutate({
        type: 'SYSTEM',
        itemName: data.itemName || 'Unknown',
        quantity: 0,
        reason: 'Item deleted',
        remarks: `Item ID: ${data.id}`,
        dateTime: new Date().toISOString(),
      });
    },
    onError: (error) => toast.error(getAxiosErrorMessage(error) || 'Failed to delete item'),
  });
};

/* ================= ADD CATEGORY ================= */
export const useAddCategory = () => {
  const queryClient = useQueryClient();
  const createTransaction = useCreateTransaction();

  const addCategory = async (data) => {
    const response = await authenticatedApi.post('/inventory/item-categories', data);
    if (![200, 201].includes(response.status)) throw new Error('Failed to add category');
    return response.data;
  };

  return useMutation({
    mutationFn: addCategory,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['item-categories'] });
      toast.success('Category added successfully');

      createTransaction.mutate({
        type: 'SYSTEM',
        itemName: variables.name || 'Unknown',
        quantity: 0,
        reason: 'Category added',
        remarks: `Category ID: ${data._id}`,
        dateTime: new Date().toISOString(),
      });
    },
    onError: (error) => toast.error(getAxiosErrorMessage(error) || 'Failed to add category'),
  });
};

/* ================= DELETE CATEGORY ================= */
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const createTransaction = useCreateTransaction();

  const deleteCategory = async (data) => {
    const response = await authenticatedApi.delete(`/inventory/item-categories/${data.id}`);
    if (![200, 204].includes(response.status)) throw new Error('Failed to delete category');
    return data;
  };

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['item-categories'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Category deleted successfully');

      createTransaction.mutate({
        type: 'SYSTEM',
        itemName: data.name || 'Unknown',
        quantity: 0,
        reason: 'Category deleted',
        remarks: `Category ID: ${data.id}`,
        dateTime: new Date().toISOString(),
      });
    },
    onError: (error) => toast.error(getAxiosErrorMessage(error) || 'Failed to delete category'),
  });
};

/* ================= ADD STOCK ================= */
export const useAddStock = () => {
  const queryClient = useQueryClient();
  const createTransaction = useCreateTransaction();

  return useMutation({
    mutationFn: async (data) => {
      const res = await authenticatedApi.patch(`/inventory/${data.id}/add-stock`, data);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Stock added');

      createTransaction.mutate({
        type: 'IN',
        itemName: variables.itemName || 'Unknown',
        quantity: variables.quantity || 0,
        reason: 'Stock added',
        remarks: `Item ID: ${variables.id}`,
        dateTime: new Date().toISOString(),
      });
    },
  });
};

/* ================= DEDUCT STOCK ================= */
export const useDeductStock = () => {
  const queryClient = useQueryClient();
  const createTransaction = useCreateTransaction();

  return useMutation({
    mutationFn: async (data) => {
      const res = await authenticatedApi.patch(`/inventory/${data.id}/deduct-stock`, data);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Stock deducted');

      createTransaction.mutate({
        type: 'OUT',
        itemName: variables.itemName || 'Unknown',
        quantity: variables.quantity || 0,
        reason: 'Stock deducted',
        remarks: `Item ID: ${variables.id}`,
        dateTime: new Date().toISOString(),
      });
    },
  });
};
