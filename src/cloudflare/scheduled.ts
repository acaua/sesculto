import { updateEventsAndCategories } from "@/cloudflare/updateEventsAndCategories";
import { updateBranches } from "@/cloudflare/updateBranches";

export async function scheduled(controller: ScheduledController, env: Env) {
  switch (controller.cron) {
    case "2 * * * *":
      await updateEventsAndCategories(env);
      break;
    case "1 * * * 1":
      await updateBranches(env);
      break;
  }
}
