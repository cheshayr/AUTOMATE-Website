import { useQuery } from "@tanstack/react-query";
import authenticatedApi from "@/api/axiosInstance";

export const useFetchSuppliers = () => {
  return useQuery({
    queryKey: ["suppliers"], // This MUST match ["suppliers"] in your mutation
    queryFn: async () => {
      const response = await authenticatedApi.get("/inventory/suppliers");
      return response.data;
    },
  });
};
