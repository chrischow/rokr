import { useQuery } from "react-query";
import { constructUrl, constructPostQueryFn } from "../utils/query";
import { config } from "../config";

// Query token
export default function useToken() {
  const url = config.apiUrl + 'contextinfo';

  return useQuery(['token'], constructPostQueryFn(url), {
    staleTime: config.tokenRefreshTime
  });
}