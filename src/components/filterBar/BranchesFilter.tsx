import { useMemo } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { type StatefulSet } from "@/hooks/useSet";
import { Button } from "@/components/ui/button";
import { REGIONS, type BranchesByRegion, type Region } from "@/api/branches";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface BranchesFilterProps {
  branchesByRegion: BranchesByRegion;
  branchesFilterSet: StatefulSet<string>;
  handleRegionSelection: (regionName: Region, isSelected: boolean) => void;
}

export function BranchesFilter({
  branchesByRegion,
  branchesFilterSet,
  handleRegionSelection,
}: BranchesFilterProps) {
  const regionSelectionStates = useMemo(() => {
    const stateMap = new Map();

    for (const [region, branches] of Object.entries(branchesByRegion)) {
      const isSelected = branches.every((b) => branchesFilterSet.has(b));

      const isPartiallySelected =
        branches.some((b) => branchesFilterSet.has(b)) && !isSelected;

      stateMap.set(region, {
        isSelected,
        isPartiallySelected,
      });
    }

    return stateMap;
  }, [branchesByRegion, branchesFilterSet]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex w-40 items-center justify-between"
        >
          <div className="flex items-center gap-2">
            Unidades
            {branchesFilterSet.size > 0 && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                {branchesFilterSet.size}
              </div>
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-80 w-56 overflow-auto">
        {REGIONS.map((region, index) => {
          const regionState = regionSelectionStates.get(region) || {
            isSelected: false,
            isPartiallySelected: false,
          };

          return (
            <div key={region}>
              <DropdownMenuLabel className="font-bold">
                <DropdownMenuCheckboxItem
                  checked={regionState.isSelected}
                  onCheckedChange={(checked) => {
                    handleRegionSelection(region, checked);
                  }}
                  onSelect={(event) => event.preventDefault()}
                  className={cn(
                    "capitalize",
                    regionState.isPartiallySelected
                      ? "bg-gray-100 dark:bg-gray-800"
                      : "",
                  )}
                >
                  {region}
                </DropdownMenuCheckboxItem>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {branchesByRegion[region].map((branch) => (
                <DropdownMenuCheckboxItem
                  key={branch}
                  checked={branchesFilterSet.has(branch)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      branchesFilterSet.add(branch);
                    } else {
                      branchesFilterSet.delete(branch);
                    }
                  }}
                  onSelect={(event) => event.preventDefault()}
                >
                  {branch}
                </DropdownMenuCheckboxItem>
              ))}
              {index !== branchesByRegion[region].length - 1 && (
                <DropdownMenuSeparator />
              )}
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
