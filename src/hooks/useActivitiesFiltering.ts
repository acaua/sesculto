import { useState, useMemo, useCallback } from "react";

import { useActivities } from "@/hooks/useActivities";
import { useCategories } from "@/hooks/useCategories";
import { useFuse } from "@/hooks/useFuse";
import { useSet } from "@/hooks/useSet";

export function useActivitiesFiltering() {
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

  const hasFilters =
    branchesFilterSet.size > 0 ||
    categoriesFilterSet.size > 0 ||
    searchString.length > 0;

  const error = errorActivities || errorCategories;

  return {
    activities,
    filteredActivities,
    categories,
    setSearchString,
    hasFilters,
    resetFilters,
    branchesFilterSet,
    categoriesFilterSet,
    error,
  };
}
