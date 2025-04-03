import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounceValue } from "usehooks-ts";

import { fetchCategories } from "@/api/categories";
import type { FilterState } from "@/hooks/useActivitiesFiltering";
import { useBranches } from "@/hooks/useBranches";
import type { FilterOption } from "@/components/FilterBar";
import queryClient from "@/lib/queryClient";

interface UseFilterBarStateProps {
  onFilterChange: (filters: FilterState) => void;
  debounceTime?: number;
}

export function useFilterBarState({
  onFilterChange,
  debounceTime = 250,
}: UseFilterBarStateProps) {
  // State variables
  const [searchInputValue, setSearchInputValue] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);

  const [debouncedSearch] = useDebounceValue(searchInputValue, debounceTime);

  const { regionOptions, allBranches } = useBranches();

  const { data: categories } = useQuery(
    {
      queryKey: ["categories"],
      queryFn: fetchCategories,
      staleTime: 60 * 60 * 1000, // 1 hour
    },
    queryClient,
  );

  const hasFilters =
    !!debouncedSearch ||
    selectedCategories.length > 0 ||
    selectedBranches.length > 0;

  // Update parent component with filters
  useEffect(() => {
    onFilterChange({
      search: debouncedSearch,
      categories: selectedCategories,
      branches: selectedBranches,
    });
  }, [debouncedSearch, selectedCategories, selectedBranches, onFilterChange]);

  // Helper functions for common operations
  const addCategory = useCallback((category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev : [...prev, category],
    );
  }, []);

  const addBranch = useCallback((branch: string) => {
    setSelectedBranches((prev) =>
      prev.includes(branch) ? prev : [...prev, branch],
    );
  }, []);

  // Action handlers
  const resetFilters = useCallback(() => {
    setSearchInputValue("");
    setSelectedCategories([]);
    setSelectedBranches([]);
  }, []);

  const handleRegionSelection = useCallback(
    (regionName: string, isSelected: boolean) => {
      const region = regionOptions.find((r) => r.name === regionName);
      if (!region) return;

      if (isSelected) {
        setSelectedBranches((prev) => {
          // Add branches not already selected
          const newBranches = region.branches.filter((b) => !prev.includes(b));
          return [...prev, ...newBranches];
        });
      } else {
        setSelectedBranches((prev) =>
          prev.filter((b) => !region.branches.includes(b)),
        );
      }
    },
    [regionOptions],
  );

  const handleAutocompleteSelection = useCallback(
    (item: FilterOption) => {
      if (item.type === "category") {
        addCategory(item.value);
      } else {
        addBranch(item.value);
      }
      setSearchInputValue("");
    },
    [addCategory, addBranch],
  );

  const handleRemoveCategory = useCallback((category: string) => {
    setSelectedCategories((prev) => prev.filter((c) => c !== category));
  }, []);

  const handleRemoveBranch = useCallback((branch: string) => {
    setSelectedBranches((prev) => prev.filter((b) => b !== branch));
  }, []);

  const handleImmediateSearch = useCallback(() => {
    onFilterChange({
      search: searchInputValue,
      categories: selectedCategories,
      branches: selectedBranches,
    });
  }, [searchInputValue, selectedCategories, selectedBranches, onFilterChange]);

  return {
    // State and derived data
    categories,
    searchInputValue,
    selectedCategories,
    selectedBranches,
    hasFilters,
    regionOptions,
    allBranches,

    // Actions
    setSearchInputValue,
    setSelectedCategories,
    setSelectedBranches,
    resetFilters,
    handleRegionSelection,
    handleAutocompleteSelection,
    handleRemoveCategory,
    handleRemoveBranch,
    handleImmediateSearch,
  };
}
