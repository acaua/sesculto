import { useState, useMemo, useCallback } from "react";

import type { FilterOption } from "@/components/FilterBar";
import type { Activity } from "@/api/activities";
import type { BranchesByRegion, Region } from "@/api/branches";
import { useActivities } from "@/hooks/useActivities";
import { useBranches } from "@/hooks/useBranches";
import { useCategories } from "@/hooks/useCategories";
import { useFuse } from "@/hooks/useFuse";
import { useSet, type StatefulSet } from "@/hooks/useSet";
import { useGroupedFilter, type GroupedFilter } from "@/hooks/useGroupedFilter";
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
  categoriesFilterSet: StatefulSet<string>;
  branchesFilter: GroupedFilter<Region>;
  error: Error | null;
  handleAutocompleteSelection: (item: FilterOption) => void;
}

export function useActivitiesFiltering(): useActivitiesFilteringReturn {
  const { activities, error: errorActivities } = useActivities();
  const { branchesByRegion, error: errorBranches } = useBranches();
  const { categories, error: errorCategories } = useCategories();

  const [searchString, setSearchString] = useState("");
  const [debouncedSearchString, { flush: flushSearchString }] =
    useDebouncedValue(searchString, 500);

  const branchesFilter = useGroupedFilter<Region>(branchesByRegion);
  const categoriesFilterSet = useSet<string>();

  const { filteredList: searchedActivities } = useFuse(
    activities,
    debouncedSearchString,
    { keys: ["title", "details"] },
  );

  const filteredActivities = useMemo(() => {
    if (!searchedActivities) return undefined;

    return searchedActivities.filter((activity) => {
      const matchesBranches =
        !branchesFilter.hasFilter || branchesFilter.has(activity.branch);

      const matchesCategories =
        categoriesFilterSet.size === 0 ||
        activity.categories.some((category) =>
          categoriesFilterSet.has(category),
        );

      return matchesCategories && matchesBranches;
    });
  }, [searchedActivities, branchesFilter, categoriesFilterSet]);

  const resetFilters = useCallback(() => {
    branchesFilter.clear();
    categoriesFilterSet.clear();
    setSearchString("");
    flushSearchString();
  }, [branchesFilter, categoriesFilterSet, setSearchString, flushSearchString]);

  const hasFilters =
    branchesFilter.hasFilter ||
    categoriesFilterSet.size > 0 ||
    searchString.length > 0;

  const error = errorActivities || errorCategories || errorBranches;

  const handleAutocompleteSelection = useCallback(
    (item: FilterOption) => {
      if (item.type === "category") {
        categoriesFilterSet.add(item.value);
      } else {
        // Use toggleItem for branch selection
        branchesFilter.toggleItem(item.value);
      }

      setSearchString("");
      flushSearchString();
    },
    [branchesFilter, categoriesFilterSet, setSearchString, flushSearchString],
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
    categoriesFilterSet,
    branchesFilter,
    error,
    handleAutocompleteSelection,
  };
}
