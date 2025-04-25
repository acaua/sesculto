import { fetchEventsFromSesc, sescEventToEvent } from "@/api/sesc/sescEvents";
import { extractUniqueCategories } from "@/api/categories";

export async function updateEventsAndCategories(env: Env) {
  const sescEvents = await fetchEventsFromSesc();
  const events = sescEvents.map(sescEventToEvent);
  const categories = extractUniqueCategories(events);

  const options = {
    httpMetadata: {
      contentType: "application/json",
    },
  };

  await env.SESCONTENT_BUCKET.put(
    "events.json",
    JSON.stringify(events),
    options,
  );
  await env.SESCONTENT_BUCKET.put(
    "categories.json",
    JSON.stringify(categories),
    options,
  );
}
