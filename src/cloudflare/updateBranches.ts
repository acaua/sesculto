import { fetchBranchesFromSesc } from "@/api/sesc/sescBranches";
import { sescBranchesByRegionToBranchesByRegion } from "@/api/sesc/sescBranches";

export async function updateBranches(env: Env) {
  const sescBranches = await fetchBranchesFromSesc();

  const branchesByRegion = sescBranchesByRegionToBranchesByRegion(sescBranches);

  const options = {
    httpMetadata: {
      contentType: "application/json",
    },
  };

  await env.SESCONTENT_BUCKET.put(
    "branches.json",
    JSON.stringify(branchesByRegion),
    options,
  );
}
