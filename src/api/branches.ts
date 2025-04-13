export const REGIONS = ["capital", "interior", "litoral"] as const;

export type Region = (typeof REGIONS)[number];

export type BranchesByRegion = {
  [K in Region]: string[];
};

export const fetchBranches = async (): Promise<BranchesByRegion> => {
  const response = await fetch("https://sescontent.acaua.dev/branches.json");
  if (!response.ok) {
    throw new Error("Failed to fetch branches");
  }

  const branchesByRegion: BranchesByRegion = await response.json();

  return branchesByRegion;
};
