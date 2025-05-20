import { REGIONS, type BranchesByRegion, type Region } from "@/api/branches";

interface SescBranch {
  groupName: string;
  groupType: string;
  groupID: string;
  groupLink: string;
  doc_count: number;
}

export type BranchesByRegionSesc = {
  [K in Region]: SescBranch[];
};

interface ApiResponse {
  unidades: BranchesByRegionSesc;
}

export const fetchBranchesFromSesc =
  async (): Promise<BranchesByRegionSesc> => {
    const response = await fetch(
      "https://www.sescsp.org.br/wp-json/wp/v1/dinamico?modes=unidade",
    );
    if (!response.ok) {
      throw new Error("Failed to fetch branches");
    }

    const jsonResponse: ApiResponse = await response.json();

    return jsonResponse.unidades;
  };

const sescBranchToBranch = (branch: SescBranch): string => branch.groupName;

export const sescBranchesByRegionToBranchesByRegion = (
  branchesByRegionSesc: BranchesByRegionSesc,
) => {
  const branchesByRegion = Object.fromEntries(
    REGIONS.map((region) => [
      region,
      branchesByRegionSesc[region].map(sescBranchToBranch).sort(),
    ]),
  ) as BranchesByRegion;

  return branchesByRegion;
};
