import { useState, useMemo, useCallback } from "react";

import type { FilterOption } from "@/components/FilterBar";
import type { Activity } from "@/api/activities";
import type { BranchesByRegion, Region } from "@/api/branches";
import { useActivities } from "@/hooks/useActivities";
import { useBranches } from "@/hooks/useBranches";
import { useCategories } from "@/hooks/useCategories";
import { useFuse } from "@/hooks/useFuse";
import { useSet, type StatefulSet } from "@/hooks/useSet";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

interface useActivitiesFilteringReturn {
  activities: Activity[] | undefined;
  filteredActivities: Activity[] | undefined;
  branchesByRegion: BranchesByRegion | undefined;
  categories: string[] | undefined;
  searchString: string;
  setSearchString: (value: string) => void;
  flushSearchString: () => void;
  hasFilters: boolean;
  resetFilters: () => void;
  branchesFilterSet: StatefulSet<string>;
  categoriesFilterSet: StatefulSet<string>;
  error: Error | null;
  handleRegionSelection: (regionName: Region, isSelected: boolean) => void;
  handleAutocompleteSelection: (item: FilterOption) => void;
}

export function useActivitiesFiltering(): useActivitiesFilteringReturn {
  const [searchString, setSearchString] = useState("");
  const branchesFilterSet = useSet<string>();
  const categoriesFilterSet = useSet<string>();

  const [debouncedSearchString, { flush: flushSearchString }] =
    useDebouncedValue(searchString, 500);

  const { activities, error: errorActivities } = useActivities();
  const { branchesByRegion, error: errorBranches } = useBranches();
  const { categories, error: errorCategories } = useCategories();

  const { filteredList: searchedActivities } = useFuse(
    activities,
    debouncedSearchString,
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
    flushSearchString();
  }, [
    branchesFilterSet,
    categoriesFilterSet,
    setSearchString,
    flushSearchString,
  ]);

  const hasFilters = useMemo(
    () =>
      branchesFilterSet.size > 0 ||
      categoriesFilterSet.size > 0 ||
      searchString.length > 0,
    [branchesFilterSet.size, categoriesFilterSet.size, searchString],
  );

  const error = errorActivities || errorCategories || errorBranches;

  const handleRegionSelection = useCallback(
    (region: Region, isSelected: boolean) => {
      if (!branchesByRegion) return;

      if (isSelected) {
        branchesFilterSet.add(branchesByRegion[region]);
      } else {
        branchesFilterSet.delete(branchesByRegion[region]);
      }
    },
    [branchesByRegion, branchesFilterSet],
  );

  const handleAutocompleteSelection = useCallback(
    (item: FilterOption) => {
      if (item.type === "category") {
        categoriesFilterSet.add(item.value);
      } else {
        branchesFilterSet.add(item.value);
      }

      setSearchString("");
      flushSearchString();
    },
    [
      branchesFilterSet,
      categoriesFilterSet,
      setSearchString,
      flushSearchString,
    ],
  );

  return {
    activities,
    filteredActivities,
    branchesByRegion,
    categories,
    searchString,
    setSearchString,
    flushSearchString,
    hasFilters,
    resetFilters,
    branchesFilterSet,
    categoriesFilterSet,
    error,
    handleRegionSelection,
    handleAutocompleteSelection,
  };
}
