import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

import { SearchBar } from "@/components/filterBar/SearchBar";
import { CategoriesFilter } from "@/components/filterBar/CategoriesFilter";
import { BranchesFilter } from "@/components/filterBar/BranchesFilter";
import { useFilterBarState } from "@/components/filterBar/useFilterBarState";
import { type StatefulSet } from "@/hooks/useSet";

export interface FilterOption {
  value: string;
  type: "category" | "branch";
}

interface FilterBarProps {
  categories: string[];
  setSearchString: (searchString: string) => void;
  hasFilters: boolean;
  resetFilters: () => void;
  branchesFilterSet: StatefulSet<string>;
  categoriesFilterSet: StatefulSet<string>;
}

export function FilterBar({
  categories,
  setSearchString,
  hasFilters,
  resetFilters,
  branchesFilterSet,
  categoriesFilterSet,
}: FilterBarProps) {
  const {
    searchInputValue,
    regionOptions,
    allBranches,
    handleSearchInputValueChange,
    handleRegionSelection,
    handleAutocompleteSelection,
    handleImmediateSearch,
  } = useFilterBarState({
    setSearchString,
    branchesFilterSet,
    categoriesFilterSet,
  });

  return (
    <div className="sticky top-0 z-10 mb-6 border-b bg-white py-4 dark:bg-gray-950">
      <div className="flex flex-col gap-3 md:flex-row">
        {/* Search Bar */}
        <SearchBar
          categories={categories}
          searchInputValue={searchInputValue}
          setSearchInputValue={handleSearchInputValueChange}
          allBranches={allBranches}
          onAutocompleteSelection={handleAutocompleteSelection}
          onEnterPress={handleImmediateSearch}
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
