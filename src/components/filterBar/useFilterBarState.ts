import { useState, useCallback } from "react";
import { useDebounceCallback } from "usehooks-ts";

import { useBranches } from "@/hooks/useBranches";
import type { FilterOption } from "@/components/FilterBar";
import { type StatefulSet } from "@/hooks/useSet";

interface UseFilterBarStateProps {
  setSearchString: (searchString: string) => void;
  branchesFilterSet: StatefulSet<string>;
  categoriesFilterSet: StatefulSet<string>;
  debounceTime?: number;
}

export function useFilterBarState({
  setSearchString: onSearchStringChange,
  branchesFilterSet,
  categoriesFilterSet,
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
        branchesFilterSet.add(region.branches);
      } else {
        branchesFilterSet.delete(region.branches);
      }
    },
    [regionOptions, branchesFilterSet],
  );

  const handleAutocompleteSelection = useCallback(
    (item: FilterOption) => {
      if (item.type === "category") {
        categoriesFilterSet.add(item.value);
      } else {
        branchesFilterSet.add(item.value);
      }

      handleSearchInputValueChange("");
      debounceCallback.flush();
    },
    [
      branchesFilterSet,
      categoriesFilterSet,
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
