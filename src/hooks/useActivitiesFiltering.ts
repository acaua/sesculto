import { useState, useMemo, useCallback } from "react";

import useActivities from "@/hooks/useActivities";
import useCategories from "@/hooks/useCategories";
import useFuse from "@/hooks/useFuse";

export function useActivitiesFiltering() {
  const [branchesFilter, setBranchesFilter] = useState<string[]>([]);
  const [categoriesFilter, setCategoriesFilter] = useState<string[]>([]);

  const { activities, error: errorActivities } = useActivities();
  const { categories, error: errorCategories } = useCategories();

  const {
    filteredList: searchedActivities,
    searchString,
    setSearchString,
  } = useFuse(activities, { keys: ["title", "details"] });

  const filteredActivities = useMemo(() => {
    if (!searchedActivities) return undefined;

    return searchedActivities.filter((activity) => {
      // Filter by categories
      const matchesCategories =
        categoriesFilter.length === 0 ||
        activity.categories.some((category) =>
          categoriesFilter.includes(category),
        );

      // Filter by locations
      const matchesUnidades =
        branchesFilter.length === 0 || branchesFilter.includes(activity.branch);

      return matchesCategories && matchesUnidades;
    });
  }, [searchedActivities, categoriesFilter, branchesFilter]);

  const addCategoryToFilters = useCallback(
    (category: string) => {
      setCategoriesFilter((prevCategoriesFilter) => [
        ...prevCategoriesFilter,
        category,
      ]);
    },
    [setCategoriesFilter],
  );

  const removeCategoryFromFilters = useCallback(
    (category: string) => {
      setCategoriesFilter((prevCategoriesFilter) =>
        prevCategoriesFilter.filter((c) => c !== category),
      );
    },
    [setCategoriesFilter],
  );

  const addBranchesToFilters = useCallback(
    (branches: string | string[]) => {
      setBranchesFilter((prevBranchesFilter) => {
        const branchesToAdd = Array.isArray(branches)
          ? branches.filter((b) => !prevBranchesFilter.includes(b))
          : [branches];

        return [...prevBranchesFilter, ...branchesToAdd];
      });
    },
    [setBranchesFilter],
  );

  const removeBranchesFromFilters = useCallback(
    (branches: string | string[]) => {
      setBranchesFilter((prevBranchesFilter) =>
        prevBranchesFilter.filter((b) =>
          Array.isArray(branches) ? !branches.includes(b) : b !== branches,
        ),
      );
    },
    [setBranchesFilter],
  );

  const resetFilters = useCallback(() => {
    setBranchesFilter([]);
    setCategoriesFilter([]);
    setSearchString("");
  }, [setBranchesFilter, setCategoriesFilter, setSearchString]);

  const hasFilters =
    branchesFilter.length > 0 ||
    categoriesFilter.length > 0 ||
    searchString.length > 0;

  const error = errorActivities || errorCategories;

  return {
    activities,
    filteredActivities,
    categories,
    setSearchString,
    hasFilters,
    resetFilters,
    branchesFilter,
    addCategoryToFilters,
    removeCategoryFromFilters,
    categoriesFilter,
    addBranchesToFilters,
    removeBranchesFromFilters,
    error,
  };
}
