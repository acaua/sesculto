import { useState, useMemo, useCallback } from "react";

import type { Activity } from "@/api/activities";
import { useActivities } from "@/hooks/useActivities";
import { useBranches, type RegionOption } from "@/hooks/useBranches";
import { useCategories } from "@/hooks/useCategories";
import { useFuse } from "@/hooks/useFuse";
import { useSet, type StatefulSet } from "@/hooks/useSet";
import type { FilterOption } from "@/components/FilterBar";

interface useActivitiesFilteringReturn {
  activities: Activity[] | undefined;
  filteredActivities: Activity[] | undefined;
  allBranches: string[];
  regionOptions: RegionOption[];
  categories: string[] | undefined;
  searchString: string;
  setSearchString: (value: string) => void;
  hasFilters: boolean;
  resetFilters: () => void;
  branchesFilterSet: StatefulSet<string>;
  categoriesFilterSet: StatefulSet<string>;
  error: Error | null;
  handleRegionSelection: (regionName: string, isSelected: boolean) => void;
  handleAutocompleteSelection: (item: FilterOption) => void;
}

export function useActivitiesFiltering(): useActivitiesFilteringReturn {
  const [searchString, setSearchString] = useState("");
  const branchesFilterSet = useSet<string>();
  const categoriesFilterSet = useSet<string>();

  const { activities, error: errorActivities } = useActivities();
  const { regionOptions, allBranches, error: errorBranches } = useBranches();
  const { categories, error: errorCategories } = useCategories();

  const { filteredList: searchedActivities } = useFuse(
    activities,
    searchString,
    { keys: ["title", "details"] },
  );

  const filteredActivities = useMemo(() => {
    if (!searchedActivities) return undefined;

    return searchedActivities.filter((activity) => {
      // Filter by categories
      const matchesCategories =
        categoriesFilterSet.size === 0 ||
        activity.categories.some((category) =>
          categoriesFilterSet.has(category),
        );

      // Filter by locations
      const matchesBranches =
        branchesFilterSet.size === 0 || branchesFilterSet.has(activity.branch);

      return matchesCategories && matchesBranches;
    });
  }, [searchedActivities, branchesFilterSet, categoriesFilterSet]);

  const resetFilters = useCallback(() => {
    branchesFilterSet.clear();
    categoriesFilterSet.clear();
    setSearchString("");
  }, [branchesFilterSet, categoriesFilterSet, setSearchString]);

  const hasFilters = useMemo(
    () =>
      branchesFilterSet.size > 0 ||
      categoriesFilterSet.size > 0 ||
      searchString.length > 0,
    [branchesFilterSet.size, categoriesFilterSet.size, searchString],
  );

  const error = errorActivities || errorCategories || errorBranches;

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
    },
    [branchesFilterSet, categoriesFilterSet],
  );

  return {
    activities,
    filteredActivities,
    allBranches,
    regionOptions,
    categories,
    searchString,
    setSearchString,
    hasFilters,
    resetFilters,
    branchesFilterSet,
    categoriesFilterSet,
    error,
    handleRegionSelection,
    handleAutocompleteSelection,
  };
}
