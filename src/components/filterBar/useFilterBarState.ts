import { useState, useCallback } from "react";
import { useDebounceCallback } from "usehooks-ts";

import { useBranches } from "@/hooks/useBranches";
import type { FilterOption } from "@/components/FilterBar";

interface UseFilterBarStateProps {
  setSearchString: (searchString: string) => void;
  addBranchesToFilters: (branchId: string | string[]) => void;
  removeBranchesFromFilters: (branches: string | string[]) => void;
  addCategoryToFilters: (categoryId: string) => void;
  debounceTime?: number;
}

export function useFilterBarState({
  setSearchString: onSearchStringChange,
  addBranchesToFilters,
  removeBranchesFromFilters,
  addCategoryToFilters,
  debounceTime = 250,
}: UseFilterBarStateProps) {
  const [searchInputValue, setSearchInputValue] = useState("");

  const debounceCallback = useDebounceCallback((searchValue) => {
    onSearchStringChange(searchValue);
  }, debounceTime);

  const { regionOptions, allBranches } = useBranches();

  const handleSearchInputValueChange = useCallback(
    (searchValue: string) => {
      setSearchInputValue(searchValue);
      debounceCallback(searchValue);
    },
    [setSearchInputValue, debounceCallback],
  );

  const handleRegionSelection = useCallback(
    (regionName: string, isSelected: boolean) => {
      const region = regionOptions.find((r) => r.name === regionName);
      if (!region) return;

      if (isSelected) {
        addBranchesToFilters(region.branches);
      } else {
        removeBranchesFromFilters(region.branches);
      }
    },
    [regionOptions, addBranchesToFilters, removeBranchesFromFilters],
  );

  const handleAutocompleteSelection = useCallback(
    (item: FilterOption) => {
      if (item.type === "category") {
        addCategoryToFilters(item.value);
      } else {
        addBranchesToFilters(item.value);
      }

      handleSearchInputValueChange("");
      debounceCallback.flush();
    },
    [
      addBranchesToFilters,
      addCategoryToFilters,
      handleSearchInputValueChange,
      debounceCallback,
    ],
  );

  const handleImmediateSearch = useCallback(() => {
    debounceCallback.flush();
  }, [debounceCallback]);

  return {
    // State and derived data
    searchInputValue,
    regionOptions,
    allBranches,

    // Actions
    handleSearchInputValueChange,
    handleRegionSelection,
    handleAutocompleteSelection,
    handleImmediateSearch,
  };
}
