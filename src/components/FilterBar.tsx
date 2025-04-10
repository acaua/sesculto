import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

import { SearchBar } from "@/components/filterBar/SearchBar";
import { CategoriesFilter } from "@/components/filterBar/CategoriesFilter";
import { BranchesFilter } from "@/components/filterBar/BranchesFilter";
import { type StatefulSet } from "@/hooks/useSet";
import { type RegionOption } from "@/hooks/useBranches";

export interface FilterOption {
  value: string;
  type: "category" | "branch";
}

interface FilterBarProps {
  allBranches: string[];
  regionOptions: RegionOption[];
  categories: string[];
  searchString: string;
  setSearchString: (searchString: string) => void;
  hasFilters: boolean;
  resetFilters: () => void;
  branchesFilterSet: StatefulSet<string>;
  categoriesFilterSet: StatefulSet<string>;
  handleRegionSelection: (regionName: string, isSelected: boolean) => void;
  handleAutocompleteSelection: (item: FilterOption) => void;
}

export function FilterBar({
  allBranches,
  regionOptions,
  categories,
  searchString,
  setSearchString,
  hasFilters,
  resetFilters,
  branchesFilterSet,
  categoriesFilterSet,
  handleRegionSelection,
  handleAutocompleteSelection,
}: FilterBarProps) {
  return (
    <div className="sticky top-0 z-10 mb-6 border-b bg-white py-4 dark:bg-gray-950">
      <div className="flex flex-col gap-3 md:flex-row">
        {/* Search Bar */}
        <SearchBar
          searchString={searchString}
          setSearchString={setSearchString}
          categories={categories}
          allBranches={allBranches}
          onAutocompleteSelection={handleAutocompleteSelection}
          // onEnterPress={handleImmediateSearch}
        />

        {/* Categories and Branches dropdown filters */}
        <div className="flex gap-2">
          <CategoriesFilter
            categories={categories}
            categoriesFilterSet={categoriesFilterSet}
          />

          <BranchesFilter
            regionOptions={regionOptions}
            branchesFilterSet={branchesFilterSet}
            handleRegionSelection={handleRegionSelection}
          />
        </div>
      </div>
      {hasFilters && (
        <div className="mt-4">
          <Button
            variant="ghost"
            onClick={resetFilters}
            className="flex items-center"
          >
            <X className="mr-2 h-4 w-4" />
            Limpar
          </Button>
        </div>
      )}
    </div>
  );
}
