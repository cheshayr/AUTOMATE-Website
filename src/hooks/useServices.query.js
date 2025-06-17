import authenticatedApi from "@/api/axiosInstance";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useServicesQuery = () => {
  const queryClient = useQueryClient();
  const fetchServices = async () => {
    const response = await authenticatedApi.get("/services", {
      withCredentials: true,
    });
    if (response.status !== 200) {
      throw new Error("Failed to fetch services");
    }
    return response.data || [];
  };

  return useQuery({
    queryKey: ["services"],
    queryFn: () => fetchServices(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
    onError: (error) => {
      console.error("Error fetching services:", error);
    },
  });
};
