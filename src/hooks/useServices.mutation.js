import authenticatedApi, { getAxiosErrorMessage } from "@/api/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddService = () => {
  const queryClient = useQueryClient();

  const addService = async (data) => {
    const response = await authenticatedApi.post("/services", data);
    if (response.status !== 201) {
      throw new Error("Failed to add service");
    }
    return response.data;
  };

  return useMutation({
    mutationFn: (data) => addService(data),
    onSuccess: () => {
      queryClient.invalidateQueries("services");
      alert("Service added successfully");
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error) || "Failed to add service";
      console.error("Error adding service:", message);
      alert(message);
    },
  });
};

export const useEditService = () => {
  const queryClient = useQueryClient();

  const editService = async (data) => {
    const response = await authenticatedApi.patch(`/services/${data.id}`, data);
    if (response.status !== 200) {
      throw new Error("Failed to edit service");
    }
    return response.data;
  };

  return useMutation({
    mutationFn: (data) => editService(data),
    onSuccess: () => {
      queryClient.invalidateQueries("services");
      alert("Service edited successfully");
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error) || "Failed to edit service";
      console.error("Error editing service:", message);
      alert(message);
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();

  const deleteService = async (id) => {
    const response = await authenticatedApi.delete(`/services/${id}`);
    if (response.status !== 200) {
      throw new Error("Failed to delete service");
    }
    return response.data;
  };

  return useMutation({
    mutationFn: (id) => deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries("services");
      alert("Service deleted successfully");
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error) || "Failed to delete service";
      console.error("Error deleting service:", message);
      alert(message);
    },
  });
};
