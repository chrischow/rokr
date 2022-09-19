import { useQuery } from "react-query";
import { constructCreateQueryFn } from "../../shared/utils/query";
import { config } from "../../config";

// Query token
export default function useToken() {
  const url = config.apiUrl + 'contextinfo';

  return useQuery(['token'], constructCreateQueryFn(url), {
    staleTime: config.tokenRefreshTime
  });
}