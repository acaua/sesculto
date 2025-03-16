import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Activity } from "@/api/activities";
import type { FilterState } from "@/hooks/useActivitiesFiltering";

import { SearchBar } from "@/components/filterBar/SearchBar";
import { CategoriesFilter } from "@/components/filterBar/CategoriesFilter";
import { BranchesFilter } from "@/components/filterBar/BranchesFilter";
import { SelectedFilters } from "@/components/filterBar/SelectedFilters";
import { useFilterBarState } from "@/components/filterBar/useFilterBarState";

export interface FilterOption {
  value: string;
  label: string;
  color?: string;
  type: "category" | "branch";
}

interface FilterBarProps {
  activities: Activity[];
  onFilterChange: (filters: FilterState) => void;
}

export function FilterBar({ activities, onFilterChange }: FilterBarProps) {
  const {
    searchInputValue,
    setSearchInputValue,
    categories,
    selectedCategories,
    setSelectedCategories,
    selectedBranches,
    setSelectedBranches,
    hasFilters,
    regionOptions,
    allBranches,
    resetFilters,
    handleRegionSelection,
    handleAutocompleteSelection,
    handleRemoveCategory,
    handleRemoveBranch,
  } = useFilterBarState({
    activities,
    onFilterChange,
  });

  return (
    <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 py-4 border-b mb-6">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Bar */}
        <SearchBar
          searchInputValue={searchInputValue}
          setSearchInputValue={setSearchInputValue}
          categories={categories}
          allBranches={allBranches}
          onAutocompleteSelection={handleAutocompleteSelection}
        />

        {/* Categories and Branches dropdown filters */}
        <div className="flex gap-2">
          <CategoriesFilter
            categories={categories}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />

          <BranchesFilter
            regionOptions={regionOptions}
            selectedBranches={selectedBranches}
            setSelectedBranches={setSelectedBranches}
            handleRegionSelection={handleRegionSelection}
          />

          {hasFilters && (
            <Button
              variant="ghost"
              onClick={resetFilters}
              className="flex items-center"
            >
              <X className="mr-2 h-4 w-4" />
              Limpar
            </Button>
          )}
        </div>
      </div>

      {/* Show selected filters as pills */}
      <SelectedFilters
        selectedCategories={selectedCategories}
        selectedBranches={selectedBranches}
        onRemoveCategory={handleRemoveCategory}
        onRemoveBranch={handleRemoveBranch}
      />
    </div>
  );
}
