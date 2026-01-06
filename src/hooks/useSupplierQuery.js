import { useQuery } from "@tanstack/react-query";
import authenticatedApi from "@/api/axiosInstance";

export const useFetchSuppliers = () => {
  return useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const res = await authenticatedApi.get("/suppliers");
      return res.data; // must be { data: [...] }
    },
  });
};
