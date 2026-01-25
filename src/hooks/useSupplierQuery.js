import { useQuery } from "@tanstack/react-query";
import authenticatedApi from "@/api/axiosInstance";

export const useFetchSuppliers = () => {
  return useQuery({
    queryKey: ["suppliers"], // Must match ["suppliers"] in your mutations
    queryFn: async () => {
      try {
        const response = await authenticatedApi.get("/inventory/suppliers");
        if (response.status !== 200) {
          throw new Error("Failed to fetch suppliers");
        }
        return response.data || [];
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        return [];
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
  });
};
