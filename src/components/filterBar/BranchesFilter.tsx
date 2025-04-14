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

import { cn } from "@/lib/utils";
import {
  type GroupedFilter,
  GroupSelectionState,
} from "@/hooks/useGroupedFilter";
import { REGIONS, type BranchesByRegion, type Region } from "@/api/branches";

interface BranchesFilterProps {
  branchesByRegion: BranchesByRegion;
  branchesFilter: GroupedFilter<Region>;
}

export function BranchesFilter({
  branchesByRegion,
  branchesFilter,
}: BranchesFilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex w-40 items-center justify-between"
        >
          <div className="flex items-center gap-2">
            Unidades
            {branchesFilter.hasFilter && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                {branchesFilter.size}
              </div>
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-80 w-56 overflow-auto">
        {REGIONS.map((region, index) => {
          const regionState = branchesFilter.groupStates[region];

          return (
            <div key={region}>
              <DropdownMenuLabel className="font-bold">
                <DropdownMenuCheckboxItem
                  checked={regionState === GroupSelectionState.FullySelected}
                  onCheckedChange={() => branchesFilter.toggleGroup(region)}
                  // prevent closing on select
                  onSelect={(event) => event.preventDefault()}
                  className={cn(
                    "capitalize",
                    regionState === GroupSelectionState.PartiallySelected
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
                  checked={branchesFilter.has(branch)}
                  onCheckedChange={() => branchesFilter.toggleItem(branch)}
                  // prevent closing on select
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
