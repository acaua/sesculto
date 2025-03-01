import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Fuse from "fuse.js";

import queryClient from "@/lib/queryClient";
import { fetchActivities } from "@/api/activities";
import { ActivityCard } from "@/components/ActivityCard";
import { FilterBar } from "@/components/FilterBar";

export default function Activities() {
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

  const [filters, setFilters] = useState({
    search: "",
    categories: [] as string[],
    branches: [] as string[],
  });

  // Configure Fuse instance for fuzzy searching
  const fuseInstance = useMemo(() => {
    if (!activities) return null;

    return new Fuse(activities, {
      keys: ["titulo", "complemento", "categorias.link", "unidade.name"],
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
        activity.categorias.some((cat) =>
          filters.categories.includes(cat.link),
        );

      // Filter by locations
      const matchesUnidades =
        filters.branches.length === 0 ||
        activity.unidade.some((uni) => filters.branches.includes(uni.name));

      return matchesCategories && matchesUnidades;
    });
  }, [activities, filters, fuseInstance]);

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando atividades...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        Erro ao carregar as atividades. Por favor, tente novamente mais tarde.
      </div>
    );
  }

  return (
    <div>
      <FilterBar activities={activities} onFilterChange={setFilters} />

      {filteredActivities.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">
            Nenhuma atividade encontrada com os filtros selecionados.
          </p>
        </div>
      ) : (
        <div>
          <p className="mb-4 text-gray-500">
            {filteredActivities.length} atividades encontradas
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
