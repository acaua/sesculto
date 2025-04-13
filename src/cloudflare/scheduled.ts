import { updateActivitiesAndCategories } from "@/cloudflare/updateActivitiesAndCategories";
import { updateBranches } from "@/cloudflare/updateBranches";

export async function scheduled(controller: ScheduledController, env: Env) {
  switch (controller.cron) {
    case "2 * * * *":
      await updateActivitiesAndCategories(env);
      break;
    case "1 * * * 1":
      await updateBranches(env);
      break;
  }
}
