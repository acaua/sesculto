export interface Branch {
  groupName: string;
  groupType: string;
  groupID: string;
  groupLink: string;
  doc_count: number;
}

export enum Region {
  CAPITAL = "capital",
  INTERIOR = "interior",
  LITORAL = "litoral",
}

export interface BranchesByRegion {
  [Region.CAPITAL]: Branch[];
  [Region.INTERIOR]: Branch[];
  [Region.LITORAL]: Branch[];
}

interface ApiResponse {
  unidades: BranchesByRegion;
}

export const fetchBranches = async (): Promise<BranchesByRegion> => {
  const response = await fetch("https://sescontent.acaua.dev/branches.json");
  if (!response.ok) {
    throw new Error("Failed to fetch branches");
  }

  const jsonResponse: ApiResponse = await response.json();

  return jsonResponse.unidades;
};
