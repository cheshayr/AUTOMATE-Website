import authenticatedApi from '@/api/axiosInstance';
import { useQuery } from '@tanstack/react-query';

export const useGenerateReportQuery = ({ reportType, dateFrom, dateTo }) => {
  console.log('generating report...');
  const result = async () => {
    const response = await authenticatedApi.get(
      `/reports/generate?reportType=${reportType}&dateFrom=${dateFrom}&dateTo=${dateTo}`
    );
    if (response.status !== 200) {
      throw new Error('Failed to fetch services');
    }
    return response.data || [];
  };

  return useQuery({
    queryKey: ['report', reportType, dateFrom, dateTo],
    queryFn: result,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
    onError: (error) => {
      console.error('Error fetching report:', error);
    },
  });
};
