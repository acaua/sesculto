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
  isRegionSelected: (regionName: string) => boolean;
  isRegionPartiallySelected: (regionName: string) => boolean;
  handleRegionSelection: (regionName: string, isSelected: boolean) => void;
}

export function BranchesFilter({
  regionOptions,
  selectedBranches,
  setSelectedBranches,
  isRegionSelected,
  isRegionPartiallySelected,
  handleRegionSelection,
}: BranchesFilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center">
          Unidades <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 max-h-80 overflow-auto">
        {regionOptions.map((region) => (
          <div key={region.name}>
            <DropdownMenuLabel className="font-bold">
              <DropdownMenuCheckboxItem
                checked={isRegionSelected(region.name)}
                onCheckedChange={(checked) => {
                  handleRegionSelection(region.name, checked);
                }}
                className={
                  isRegionPartiallySelected(region.name)
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
            {region !== regionOptions[regionOptions.length - 1] && (
              <DropdownMenuSeparator />
            )}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
