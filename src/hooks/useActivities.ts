import { useQuery } from "@tanstack/react-query";

import queryClient from "@/lib/queryClient";
import { fetchActivities } from "@/api/activities";

export default function useActivities() {
  const {
    data: activities,
    isLoading,
    error,
  } = useQuery(
    {
      queryKey: ["activities"],
      queryFn: fetchActivities,
    },
    queryClient,
  );

  return {
    activities,
    isLoading,
    error,
  };
}
