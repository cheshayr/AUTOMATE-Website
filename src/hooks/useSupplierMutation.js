import authenticatedApi, { getAxiosErrorMessage } from "@/api/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Note: Ensure your axios base URL ends in /api
// The paths below add /inventory to match app.use('/api/inventory', inventoryRoutes)

export const useAddSupplier = () => {
  const queryClient = useQueryClient();

  const addSupplier = async (data) => {
    // UPDATED PATH
    const response = await authenticatedApi.post("/inventory/suppliers", data);
    return response.data;
  };

  return useMutation({
    mutationFn: addSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries(["suppliers"]);
      toast.success("Supplier added successfully!");
    },
    onError: (err) => {
      toast.error(getAxiosErrorMessage(err) || "Failed to add supplier");
    },
  });
};

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();

  const updateSupplier = async ({ id, ...data }) => {
    // UPDATED PATH - also changed .put to .patch to match your backend controller
    const response = await authenticatedApi.patch(`/inventory/suppliers/${id}`, data);
    return response.data;
  };

  return useMutation({
    mutationFn: updateSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries(["suppliers"]);
      toast.success("Supplier updated successfully!");
    },
    onError: (err) => {
      toast.error(getAxiosErrorMessage(err) || "Failed to update supplier");
    },
  });
};

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();

  const deleteSupplier = async (id) => {
    // UPDATED PATH
    const response = await authenticatedApi.delete(`/inventory/suppliers/${id}`);
    return response.data;
  };

  return useMutation({
    mutationFn: deleteSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries(["suppliers"]);
      toast.success("Supplier deleted successfully!");
    },
    onError: (err) => {
      toast.error(getAxiosErrorMessage(err) || "Failed to delete supplier");
    },
  });
};
