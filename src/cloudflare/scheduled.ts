import {
  fetchActivitiesFromSesc,
  sescActivityToActivity,
} from "@/api/sesc/sescActivities";
import { extractUniqueCategories } from "@/api/categories";

export default async function scheduled(
  _controller: ScheduledController,
  env: Env,
) {
  const sescActivities = await fetchActivitiesFromSesc();

  const activities = sescActivities.map(sescActivityToActivity);

  const categories = extractUniqueCategories(activities);

  const options = {
    httpMetadata: {
      contentType: "application/json",
    },
  };

  await env.SESCONTENT_BUCKET.put(
    "activities.json",
    JSON.stringify(activities),
    options,
  );
  await env.SESCONTENT_BUCKET.put(
    "categories.json",
    JSON.stringify(categories),
    options,
  );
}
