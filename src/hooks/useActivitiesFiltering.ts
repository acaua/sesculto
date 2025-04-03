import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Fuse from "fuse.js";

import { fetchActivities } from "@/api/activities";
import queryClient from "@/lib/queryClient";

export interface FilterState {
  search: string;
  categories: string[];
  branches: string[];
}

export function useActivitiesFiltering() {
  const {
    data: activities,
    isPending,
    isError,
  } = useQuery(
    {
      queryKey: ["activities"],
      queryFn: fetchActivities,
    },
    queryClient,
  );

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    categories: [],
    branches: [],
  });

  // Configure Fuse instance for fuzzy searching
  const fuseInstance = useMemo(() => {
    if (!activities) return null;

    return new Fuse(activities, {
      keys: ["title", "details", "categories", "branches"],
      threshold: 0.4, // Lower threshold = stricter matching
      ignoreLocation: true,
      useExtendedSearch: true,
    });
  }, [activities]);

  const filteredActivities = useMemo(() => {
    if (!activities) return [];

    // First apply fuzzy search if search term exists
    let searchResults = activities;
    if (filters.search && fuseInstance) {
      const fullQuery = filters.search.trim();

      if (fullQuery) {
        // First try to match the full query
        const fullQueryResults = fuseInstance
          .search(fullQuery)
          .map((result) => result.item);

        // Then split and search for individual terms
        const searchTerms = fullQuery
          .split(/\s+/)
          .filter((term) => term.length > 1);

        if (searchTerms.length > 1) {
          // Find activities that match all individual terms
          let termResults = activities;

          for (const term of searchTerms) {
            const currentTermResults = fuseInstance
              .search(term)
              .map((result) => result.item);
            termResults = termResults.filter((activity) =>
              currentTermResults.some((result) => result.id === activity.id),
            );
          }

          // Combine results: prioritize full query matches, then add term matches
          const fullQueryIds = new Set(fullQueryResults.map((item) => item.id));
          const combinedResults = [...fullQueryResults];

          for (const activity of termResults) {
            if (!fullQueryIds.has(activity.id)) {
              combinedResults.push(activity);
            }
          }

          searchResults = combinedResults;
        } else {
          // If only one term or less, just use the full query results
          searchResults = fullQueryResults;
        }
      }
    }

    // Then apply category and branch filters
    return searchResults.filter((activity) => {
      // Filter by categories
      const matchesCategories =
        filters.categories.length === 0 ||
        activity.categories.some((category) =>
          filters.categories.includes(category),
        );

      // Filter by locations
      const matchesUnidades =
        filters.branches.length === 0 ||
        filters.branches.includes(activity.branch);

      return matchesCategories && matchesUnidades;
    });
  }, [activities, filters, fuseInstance]);

  return {
    activities,
    filteredActivities,
    filters,
    setFilters,
    isPending,
    isError,
  };
}
