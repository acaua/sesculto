import { useQuery } from "@tanstack/react-query";

import { queryClient } from "@/lib/queryClient";
import { fetchEvents } from "@/api/events";

export function useEvents() {
  const {
    data: events,
    isLoading,
    error,
  } = useQuery(
    {
      queryKey: ["events"],
      queryFn: fetchEvents,
    },
    queryClient,
  );

  return {
    events,
    isLoading,
    error,
  };
}
