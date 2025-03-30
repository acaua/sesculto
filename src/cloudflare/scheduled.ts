import { fetchActivitiesFromSesc } from "@/api/activities";

const FILENAME = "activities.json";

export default async function scheduled(
  _controller: ScheduledController,
  env: Env,
) {
  const activitiesSescResponse = await fetchActivitiesFromSesc();
  await env.SESCONTENT_BUCKET.put(
    FILENAME,
    JSON.stringify(activitiesSescResponse),
    {
      httpMetadata: {
        contentType: "application/json",
      },
    },
  );
}
