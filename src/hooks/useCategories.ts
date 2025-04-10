import { useQuery } from "@tanstack/react-query";

import { queryClient } from "@/lib/queryClient";
import { fetchCategories } from "@/api/categories";

export function useCategories() {
  const {
    data: categories,
    isLoading,
    error,
  } = useQuery(
    {
      queryKey: ["categories"],
      queryFn: fetchCategories,
      staleTime: 60 * 60 * 1000, // 1 hour
    },
    queryClient,
  );

  return {
    categories,
    isLoading,
    error,
  };
}
