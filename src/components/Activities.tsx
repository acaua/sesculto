import { useQuery } from "@tanstack/react-query";

import queryClient from "@/lib/queryClient";
import { fetchActivities } from "@/api/activities";

export default function Activities() {
  const { data, isPending, isError } = useQuery(
    {
      queryKey: ["activities"],
      queryFn: fetchActivities,
    },
    queryClient,
  );

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <div>
      {data.map((activity) => (
        <div key={activity.id}>{activity.titulo}</div>
      ))}
    </div>
  );
}
