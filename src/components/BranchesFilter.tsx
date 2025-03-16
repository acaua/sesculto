import { useMemo } from "react";
import { ChevronDown } from "lucide-react";

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
  regionOptions: {
    name: string;
    branches: { value: string; label: string }[];
  }[];
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
      const regionBranchValues = region.branches.map((b) => b.value);

      const isSelected = regionBranchValues.every((b) =>
        selectedBranches.includes(b),
      );

      const isPartiallySelected =
        regionBranchValues.some((b) => selectedBranches.includes(b)) &&
        !regionBranchValues.every((b) => selectedBranches.includes(b));

      stateMap.set(region.name, {
        isSelected,
        isPartiallySelected,
      });
    }

    return stateMap;
  }, [regionOptions, selectedBranches]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center">
          Unidades <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 max-h-80 overflow-auto">
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
                  key={branch.value}
                  checked={selectedBranches.includes(branch.value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedBranches([...selectedBranches, branch.value]);
                    } else {
                      setSelectedBranches(
                        selectedBranches.filter((b) => b !== branch.value),
                      );
                    }
                  }}
                >
                  {branch.label}
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
