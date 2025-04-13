import { useQuery } from "@tanstack/react-query";

import { queryClient } from "@/lib/queryClient";
import { fetchBranches } from "@/api/branches";

export function useBranches() {
  const {
    data: branchesByRegion,
    isLoading,
    error,
  } = useQuery(
    {
      queryKey: ["branches"],
      queryFn: fetchBranches,
      // 1 day (a branch can't be built in a day lol)
      staleTime: 24 * 60 * 60 * 1000,
    },
    queryClient,
  );

  return {
    branchesByRegion,
    isLoading,
    error,
  };
}
