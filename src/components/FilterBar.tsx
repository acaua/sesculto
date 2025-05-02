import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

import { SearchBar } from "@/components/filterBar/SearchBar";
import { CategoriesFilter } from "@/components/filterBar/CategoriesFilter";
import { BranchesFilter } from "@/components/filterBar/BranchesFilter";
import {
  DatePickerWithRange,
  type DateRange,
} from "@/components/DatePickerWithRange";
import type { StatefulSet } from "@/hooks/useSet";
import type { GroupedFilter } from "@/hooks/useGroupedFilter";
import type { BranchesByRegion, Region } from "@/api/branches";

export interface FilterOption {
  value: string;
  type: "category" | "branch";
}

interface FilterBarProps {
  branchesByRegion: BranchesByRegion;
  categories: string[];
  searchString: string;
  setSearchString: (searchString: string) => void;
  flushSearchString: () => void;
  hasFilters: boolean;
  resetFilters: () => void;
  branchesFilter: GroupedFilter<Region>;
  categoriesFilterSet: StatefulSet<string>;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  handleAutocompleteSelection: (item: FilterOption) => void;
}

export function FilterBar({
  branchesByRegion,
  categories,
  searchString,
  setSearchString,
  flushSearchString,
  hasFilters,
  resetFilters,
  branchesFilter,
  categoriesFilterSet,
  dateRange,
  setDateRange,
  handleAutocompleteSelection,
}: FilterBarProps) {
  return (
    <div className="sticky top-0 z-10 mb-6 border-b bg-white py-4 dark:bg-gray-950">
      <div className="flex flex-col gap-3 lg:flex-row">
        {/* Search Bar */}
        <SearchBar
          searchString={searchString}
          setSearchString={setSearchString}
          categories={categories}
          branchesByRegion={branchesByRegion}
          onAutocompleteSelection={handleAutocompleteSelection}
          onEnterPress={flushSearchString}
        />

        {/* Categories and Branches dropdown filters */}
        <div className="flex gap-2">
          <CategoriesFilter
            categories={categories}
            categoriesFilterSet={categoriesFilterSet}
          />

          <BranchesFilter
            branchesByRegion={branchesByRegion}
            branchesFilter={branchesFilter}
          />
          <DatePickerWithRange selected={dateRange} onSelect={setDateRange} />
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
