import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import queryClient from "@/lib/queryClient";
import {
  fetchBranches,
  Region,
  type Branch,
  type BranchesByRegion,
} from "@/api/branches";

export interface RegionOption {
  name: string;
  branches: string[];
}

// Map for region display names
const REGION_DISPLAY_NAMES: Record<Region, string> = {
  [Region.CAPITAL]: "Capital",
  [Region.INTERIOR]: "Interior",
  [Region.LITORAL]: "Litoral",
};

export function useBranches() {
  const {
    data: branchesData,
    isLoading,
    error,
  } = useQuery(
    {
      queryKey: ["branches"],
      queryFn: fetchBranches,
      // 1 day (a branch can't be built in a day lol)
      staleTime: 24 * 60 * 60 * 1000,
    },
    queryClient,
  );

  const regionOptions = useMemo(
    () => (branchesData ? transformToRegionOptions(branchesData) : []),
    [branchesData],
  );

  const allBranches = useMemo(
    () => regionOptions.flatMap((region) => region.branches),
    [regionOptions],
  );

  return {
    regionOptions,
    allBranches,
    isLoading,
    error,
  };
}

function transformToRegionOptions(
  branchesData: BranchesByRegion,
): RegionOption[] {
  if (!branchesData) return [];

  return Object.values(Region)
    .map((region) => {
      const branches = branchesData[region];
      if (!branches?.length) return null;

      return {
        name: REGION_DISPLAY_NAMES[region],
        branches: transformBranches(branches),
      };
    })
    .filter(Boolean) as RegionOption[];
}

function transformBranches(branches: Branch[]) {
  return branches
    .map((branch) => branch.groupName)
    .sort((a, b) => a.localeCompare(b));
}
