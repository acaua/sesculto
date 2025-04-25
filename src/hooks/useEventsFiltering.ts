import { useState, useMemo, useCallback } from "react";

import type { FilterOption } from "@/components/FilterBar";
import type { Event } from "@/api/events";
import type { BranchesByRegion, Region } from "@/api/branches";
import { useEvents } from "@/hooks/useEvents";
import { useBranches } from "@/hooks/useBranches";
import { useCategories } from "@/hooks/useCategories";
import { useFuse } from "@/hooks/useFuse";
import { useSet, type StatefulSet } from "@/hooks/useSet";
import { useGroupedFilter, type GroupedFilter } from "@/hooks/useGroupedFilter";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

interface useEventsFilteringReturn {
  events: Event[] | undefined;
  filteredEvents: Event[] | undefined;
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

export function useEventsFiltering(): useEventsFilteringReturn {
  const { events, error: errorEvents } = useEvents();
  const { branchesByRegion, error: errorBranches } = useBranches();
  const { categories, error: errorCategories } = useCategories();

  const [searchString, setSearchString] = useState("");
  const [debouncedSearchString, { flush: flushSearchString }] =
    useDebouncedValue(searchString, 500);

  const branchesFilter = useGroupedFilter<Region>(branchesByRegion);
  const categoriesFilterSet = useSet<string>();

  const { filteredList: searchedEvents } = useFuse(
    events,
    debouncedSearchString,
    { keys: ["title", "details"] },
  );

  const filteredEvents = useMemo(() => {
    if (!searchedEvents) return undefined;

    return searchedEvents.filter((event) => {
      const matchesBranches =
        !branchesFilter.hasFilter || branchesFilter.has(event.branch);

      const matchesCategories =
        categoriesFilterSet.size === 0 ||
        event.categories.some((category) => categoriesFilterSet.has(category));

      return matchesCategories && matchesBranches;
    });
  }, [searchedEvents, branchesFilter, categoriesFilterSet]);

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

  const error = errorEvents || errorCategories || errorBranches;

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
    events,
    filteredEvents,
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
