import { useState, useMemo, useCallback } from "react";

import type { Activity } from "@/api/activities";
import { useActivities } from "@/hooks/useActivities";
import { useCategories } from "@/hooks/useCategories";
import { useFuse } from "@/hooks/useFuse";
import { useSet, type StatefulSet } from "@/hooks/useSet";

interface useActivitiesFilteringReturn {
  activities: Activity[] | undefined;
  filteredActivities: Activity[] | undefined;
  categories: string[] | undefined;
  setSearchString: (value: string) => void;
  hasFilters: boolean;
  resetFilters: () => void;
  branchesFilterSet: StatefulSet<string>;
  categoriesFilterSet: StatefulSet<string>;
  error: Error | null;
}

export function useActivitiesFiltering(): useActivitiesFilteringReturn {
  const [searchString, setSearchString] = useState("");
  const branchesFilterSet = useSet<string>();
  const categoriesFilterSet = useSet<string>();

  const { activities, error: errorActivities } = useActivities();
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

  const error = errorActivities || errorCategories;

  return useMemo(
    () => ({
      activities,
      filteredActivities,
      categories,
      setSearchString,
      hasFilters,
      resetFilters,
      branchesFilterSet,
      categoriesFilterSet,
      error,
    }),
    [
      activities,
      filteredActivities,
      categories,
      setSearchString,
      hasFilters,
      resetFilters,
      branchesFilterSet,
      categoriesFilterSet,
      error,
    ],
  );
}
