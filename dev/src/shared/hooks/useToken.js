import { useQuery } from "react-query";
import { config } from "../../config";

// Query token
export default function useToken() {
  const url = config.apiUrl + 'contextinfo';

  return useQuery(
    ['token'],
    async () => { 
      return {FormDigestValue: 'fake token'};
    },
    {
      staleTime: config.tokenRefreshTime
    });
}