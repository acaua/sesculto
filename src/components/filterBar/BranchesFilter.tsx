import { useMemo } from "react";
import { ChevronDown } from "lucide-react";

import { type RegionOption } from "@/hooks/useBranches";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface BranchesFilterProps {
  regionOptions: RegionOption[];
  selectedBranches: string[];
  setSelectedBranches: (branches: string[]) => void;
  handleRegionSelection: (regionName: string, isSelected: boolean) => void;
}

export function BranchesFilter({
  regionOptions,
  selectedBranches,
  setSelectedBranches,
  handleRegionSelection,
}: BranchesFilterProps) {
  const regionSelectionStates = useMemo(() => {
    const stateMap = new Map();

    for (const region of regionOptions) {
      const isSelected = region.branches.every((b) =>
        selectedBranches.includes(b),
      );

      const isPartiallySelected =
        region.branches.some((b) => selectedBranches.includes(b)) &&
        !isSelected;

      stateMap.set(region.name, {
        isSelected,
        isPartiallySelected,
      });
    }

    return stateMap;
  }, [regionOptions, selectedBranches]);

  const numSelectedBranches = selectedBranches.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex w-40 items-center justify-between"
        >
          <div className="flex items-center gap-2">
            Unidades
            {numSelectedBranches > 0 && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                {numSelectedBranches}
              </div>
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-80 w-56 overflow-auto">
        {regionOptions.map((region, index) => {
          const regionState = regionSelectionStates.get(region.name) || {
            isSelected: false,
            isPartiallySelected: false,
          };

          return (
            <div key={region.name}>
              <DropdownMenuLabel className="font-bold">
                <DropdownMenuCheckboxItem
                  checked={regionState.isSelected}
                  onCheckedChange={(checked) => {
                    handleRegionSelection(region.name, checked);
                  }}
                  onSelect={(event) => event.preventDefault()}
                  className={
                    regionState.isPartiallySelected
                      ? "bg-gray-100 dark:bg-gray-800"
                      : ""
                  }
                >
                  {region.name}
                </DropdownMenuCheckboxItem>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {region.branches.map((branch) => (
                <DropdownMenuCheckboxItem
                  key={branch}
                  checked={selectedBranches.includes(branch)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedBranches([...selectedBranches, branch]);
                    } else {
                      setSelectedBranches(
                        selectedBranches.filter((b) => b !== branch),
                      );
                    }
                  }}
                  onSelect={(event) => event.preventDefault()}
                >
                  {branch}
                </DropdownMenuCheckboxItem>
              ))}
              {index !== regionOptions.length - 1 && <DropdownMenuSeparator />}
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
