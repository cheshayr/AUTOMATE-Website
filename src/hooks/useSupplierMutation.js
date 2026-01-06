import authenticatedApi, { getAxiosErrorMessage } from "@/api/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAddSupplier = () => {
  const queryClient = useQueryClient();

  const addSupplier = async (data) => {
    const response = await authenticatedApi.post("/suppliers", data);
    if (response.status !== 201) throw new Error("Failed to add supplier");
    return response.data;
  };

  return useMutation({
    mutationFn: addSupplier,
    onSuccess: () => queryClient.invalidateQueries("suppliers"),
    onError: (err) => toast.error(getAxiosErrorMessage(err) || "Failed to add supplier"),
  });
};

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();

  const updateSupplier = async ({ id, ...data }) => {
    const response = await authenticatedApi.put(`/suppliers/${id}`, data);
    if (response.status !== 200) throw new Error("Failed to update supplier");
    return response.data;
  };

  return useMutation({
    mutationFn: updateSupplier,
    onSuccess: () => queryClient.invalidateQueries("suppliers"),
    onError: (err) => toast.error(getAxiosErrorMessage(err) || "Failed to update supplier"),
  });
};

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();

  const deleteSupplier = async (id) => {
    const response = await authenticatedApi.delete(`/suppliers/${id}`);
    if (response.status !== 200) throw new Error("Failed to delete supplier");
    return response.data;
  };

  return useMutation({
    mutationFn: deleteSupplier,
    onSuccess: () => queryClient.invalidateQueries("suppliers"),
    onError: (err) => toast.error(getAxiosErrorMessage(err) || "Failed to delete supplier"),
  });
};
