import { useState, useEffect, useMemo } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Activity } from "@/api/activities";
import { extractUniqueCategories, type CategoryOption } from "@/api/categories";
import type { FilterState } from "@/hooks/useActivitiesFiltering";
import { useBranches } from "@/hooks/useBranches";
import { SearchBar } from "@/components/filterBar/SearchBar";
import { CategoriesFilter } from "@/components/filterBar/CategoriesFilter";
import { BranchesFilter } from "@/components/filterBar/BranchesFilter";
import { SelectedFilters } from "@/components/filterBar/SelectedFilters";

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
  const [searchInputValue, setSearchInputValue] = useState(""); // For immediate input feedback
  const [search, setSearch] = useState(""); // Debounced search value for filtering
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);

  const { regionOptions, allBranches } = useBranches();

  // Extract unique categories from activities and memoize
  const categories = useMemo<CategoryOption[]>(
    () => extractUniqueCategories(activities),
    [activities],
  );

  // Debounce search input
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      setSearch(searchInputValue);
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [searchInputValue]);

  // Update parent component with filters
  useEffect(() => {
    onFilterChange({
      search,
      categories: selectedCategories,
      branches: selectedBranches,
    });
  }, [search, selectedCategories, selectedBranches, onFilterChange]);

  const resetFilters = () => {
    setSearchInputValue("");
    setSearch("");
    setSelectedCategories([]);
    setSelectedBranches([]);
  };

  const handleRegionSelection = (regionName: string, isSelected: boolean) => {
    const region = regionOptions.find((r) => r.name === regionName);
    if (!region) return;

    const branchValues = region.branches.map((b) => b.value);

    if (isSelected) {
      // Add all branches of the region that aren't already selected
      setSelectedBranches([
        ...selectedBranches,
        ...branchValues.filter((b) => !selectedBranches.includes(b)),
      ]);
    } else {
      // Remove all branches of the region
      setSelectedBranches(
        selectedBranches.filter((b) => !branchValues.includes(b)),
      );
    }
  };

  const handleAutocompleteSelection = (item: FilterOption) => {
    if (item.type === "category") {
      if (!selectedCategories.includes(item.value)) {
        setSelectedCategories([...selectedCategories, item.value]);
      }
    } else {
      if (!selectedBranches.includes(item.value)) {
        setSelectedBranches([...selectedBranches, item.value]);
      }
    }
    setSearchInputValue("");
  };

  const hasFilters =
    !!search || selectedCategories.length > 0 || selectedBranches.length > 0;

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
        onRemoveCategory={(cat) =>
          setSelectedCategories(selectedCategories.filter((c) => c !== cat))
        }
        onRemoveBranch={(branch) =>
          setSelectedBranches(selectedBranches.filter((b) => b !== branch))
        }
      />
    </div>
  );
}
